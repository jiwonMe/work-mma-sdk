import { kv } from '@vercel/kv';

/**
 * Vercel KV 클라이언트
 * Redis 호환 키-값 저장소
 * 
 * 환경변수:
 * - KV_REST_API_URL: Vercel KV REST API URL
 * - KV_REST_API_TOKEN: Vercel KV REST API 토큰
 * 
 * Vercel 대시보드에서 KV 스토어 생성 후 자동 설정됨
 */

// Redis 키 상수
export const REDIS_KEYS = {
  // 검색어 순위 Sorted Set
  SEARCH_RANK: 'search:rank',
  // 이전 순위 스냅샷 (순위 변동 계산용)
  SEARCH_RANK_PREV: 'search:rank:prev',
  // 이전 순위 스냅샷 타임스탬프
  SEARCH_RANK_PREV_TS: 'search:rank:prev:timestamp',
  // 검색어 캐시
  SEARCH_RANK_CACHE: 'search:rank:cache',
} as const;

/**
 * Vercel KV 연결 상태 확인
 */
export async function isKVConnected(): Promise<boolean> {
  try {
    await kv.ping();
    return true;
  } catch {
    return false;
  }
}

/**
 * Vercel KV 클라이언트 export
 */
export { kv };
