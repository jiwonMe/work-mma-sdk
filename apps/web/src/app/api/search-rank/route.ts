import { NextResponse } from 'next/server';
import { kv, REDIS_KEYS } from '@/lib/redis';

/**
 * 인기 검색어 조회 API
 * GET /api/search-rank
 * 
 * Vercel KV Sorted Set에서 상위 검색어를 조회합니다.
 * - 캐싱: 1분 TTL로 캐싱
 * - 순위 변동: 이전 순위와 비교하여 변동 표시
 */

// 기본 조회 개수
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

// 캐시 TTL (초)
const CACHE_TTL = 60;

// 순위 스냅샷 간격 (밀리초)
const SNAPSHOT_INTERVAL = 5 * 60 * 1000; // 5분

export interface RankItem {
  rank: number;
  keyword: string;
  change: 'up' | 'down' | 'new' | 'same';
  changeAmount?: number;
}

export interface SearchRankResponse {
  success: boolean;
  rankings: RankItem[];
  updatedAt: string;
  error?: string;
}

/**
 * 순위 변동 계산
 */
async function calculateRankChanges(
  currentRankings: string[]
): Promise<Map<string, { change: RankItem['change']; amount?: number }>> {
  const changes = new Map<string, { change: RankItem['change']; amount?: number }>();

  try {
    // 이전 순위 스냅샷 조회
    const prevRankings = await kv.zrange(REDIS_KEYS.SEARCH_RANK_PREV, 0, -1, { rev: true });
    const prevRankMap = new Map<string, number>();

    if (Array.isArray(prevRankings)) {
      prevRankings.forEach((keyword, index) => {
        if (typeof keyword === 'string') {
          prevRankMap.set(keyword, index + 1);
        }
      });
    }

    // 현재 순위와 비교
    currentRankings.forEach((keyword, index) => {
      const currentRank = index + 1;
      const prevRank = prevRankMap.get(keyword);

      if (prevRank === undefined) {
        changes.set(keyword, { change: 'new' });
      } else if (prevRank === currentRank) {
        changes.set(keyword, { change: 'same' });
      } else if (prevRank > currentRank) {
        changes.set(keyword, { change: 'up', amount: prevRank - currentRank });
      } else {
        changes.set(keyword, { change: 'down', amount: currentRank - prevRank });
      }
    });
  } catch (error) {
    console.error('[search-rank] 순위 변동 계산 오류:', error);
    currentRankings.forEach((keyword) => {
      changes.set(keyword, { change: 'same' });
    });
  }

  return changes;
}

/**
 * 순위 스냅샷 저장 (비동기)
 */
async function saveRankSnapshot(rankings: string[]): Promise<void> {
  if (rankings.length === 0) return;

  try {
    const lastSnapshot = await kv.get<string>(REDIS_KEYS.SEARCH_RANK_PREV_TS);
    const now = Date.now();

    // 스냅샷 간격 체크
    if (lastSnapshot && now - parseInt(lastSnapshot) < SNAPSHOT_INTERVAL) {
      return;
    }

    // 이전 스냅샷 삭제
    await kv.del(REDIS_KEYS.SEARCH_RANK_PREV);

    // 새로운 스냅샷 저장
    const members: [number, string][] = rankings.map((keyword, index) => [
      rankings.length - index,
      keyword,
    ]);

    if (members.length > 0) {
      await kv.zadd(REDIS_KEYS.SEARCH_RANK_PREV, ...members.flat() as [number, string]);
    }

    await kv.set(REDIS_KEYS.SEARCH_RANK_PREV_TS, now.toString());
  } catch (error) {
    console.error('[search-rank] 스냅샷 저장 오류:', error);
  }
}

export async function GET(request: Request) {
  try {
    // 쿼리 파라미터에서 limit 추출
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = Math.min(
      Math.max(1, parseInt(limitParam || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT),
      MAX_LIMIT
    );

    // 캐시 확인
    const cached = await kv.get<SearchRankResponse>(REDIS_KEYS.SEARCH_RANK_CACHE);
    if (cached) {
      return NextResponse.json<SearchRankResponse>(cached, {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      });
    }

    // Vercel KV Sorted Set에서 상위 검색어 조회 (내림차순)
    const keywords = await kv.zrange(REDIS_KEYS.SEARCH_RANK, 0, limit - 1, { rev: true });

    // 문자열 배열로 변환
    const keywordStrings = (keywords || [])
      .filter((k): k is string => typeof k === 'string');

    // 순위 변동 계산
    const changes = await calculateRankChanges(keywordStrings);

    // 결과 구성
    const rankings: RankItem[] = keywordStrings.map((keyword, index) => {
      const changeInfo = changes.get(keyword) || { change: 'same' as const };
      return {
        rank: index + 1,
        keyword,
        change: changeInfo.change,
        changeAmount: changeInfo.amount,
      };
    });

    const response: SearchRankResponse = {
      success: true,
      rankings,
      updatedAt: new Date().toISOString(),
    };

    // 캐시 저장
    await kv.set(REDIS_KEYS.SEARCH_RANK_CACHE, response, { ex: CACHE_TTL });

    // 순위 스냅샷 저장 (비동기)
    saveRankSnapshot(keywordStrings).catch(() => {});

    return NextResponse.json<SearchRankResponse>(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('[search-rank] 조회 오류:', error);

    return NextResponse.json<SearchRankResponse>(
      {
        success: false,
        rankings: [],
        updatedAt: new Date().toISOString(),
        error: '검색 순위 조회에 실패했습니다.',
      },
      { status: 500 }
    );
  }
}
