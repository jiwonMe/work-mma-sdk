import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 검색 순위 항목 타입
 */
export interface RankItem {
  rank: number;
  keyword: string;
  change: 'up' | 'down' | 'new' | 'same';
  changeAmount?: number;
}

/**
 * API 응답 타입
 */
interface SearchRankResponse {
  success: boolean;
  rankings: RankItem[];
  updatedAt: string;
  error?: string;
}

/**
 * Hook 반환 타입
 */
interface UseSearchRankingResult {
  rankings: RankItem[];
  loading: boolean;
  error: string | null;
  updatedAt: Date | null;
  refetch: () => Promise<void>;
}

/**
 * Hook 옵션
 */
interface UseSearchRankingOptions {
  limit?: number;
  pollingInterval?: number;
  enabled?: boolean;
}

// 기본 설정
const DEFAULT_LIMIT = 10;
const DEFAULT_POLLING_INTERVAL = 30000; // 30초

/**
 * 실시간 검색 순위 조회 Hook
 * 
 * @param options - 설정 옵션
 * @returns 순위 데이터 및 상태
 * 
 * @example
 * ```tsx
 * const { rankings, loading, error, refetch } = useSearchRanking({
 *   limit: 10,
 *   pollingInterval: 30000,
 * });
 * ```
 */
export function useSearchRanking(
  options: UseSearchRankingOptions = {}
): UseSearchRankingResult {
  const {
    limit = DEFAULT_LIMIT,
    pollingInterval = DEFAULT_POLLING_INTERVAL,
    enabled = true,
  } = options;

  const [rankings, setRankings] = useState<RankItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  // 폴링 인터벌 ref (클린업용)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 검색 순위 조회
   */
  const fetchRankings = useCallback(async () => {
    if (!enabled) return;

    try {
      setError(null);

      const response = await fetch(`/api/search-rank?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
      }

      const data: SearchRankResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || '검색 순위 조회 실패');
      }

      setRankings(data.rankings);
      setUpdatedAt(new Date(data.updatedAt));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
      setError(errorMessage);
      console.error('[useSearchRanking] 조회 오류:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [limit, enabled]);

  /**
   * 수동 리페치
   */
  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchRankings();
  }, [fetchRankings]);

  // 초기 로드 및 폴링 설정
  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    // 초기 로드
    fetchRankings();

    // 폴링 설정
    if (pollingInterval > 0) {
      intervalRef.current = setInterval(fetchRankings, pollingInterval);
    }

    // 클린업
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchRankings, pollingInterval, enabled]);

  return {
    rankings,
    loading,
    error,
    updatedAt,
    refetch,
  };
}

/**
 * 검색어 기록 함수
 * 검색 수행 시 호출하여 순위에 반영
 */
export async function recordSearchKeyword(keyword: string): Promise<boolean> {
  if (!keyword || keyword.trim().length === 0) {
    return false;
  }

  try {
    const response = await fetch('/api/search-rank/record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keyword: keyword.trim() }),
    });

    if (!response.ok) {
      console.error('[recordSearchKeyword] HTTP 오류:', response.status);
      return false;
    }

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('[recordSearchKeyword] 기록 실패:', error);
    return false;
  }
}

