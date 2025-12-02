import Redis from 'ioredis';

/**
 * Redis 클라이언트 싱글톤
 * Redis Cloud 또는 기타 외부 Redis 서비스 연결
 */

// 글로벌 타입 선언 (개발 환경에서 핫 리로딩 시 중복 연결 방지)
declare global {
  // eslint-disable-next-line no-var
  var redis: Redis | undefined;
}

/**
 * Redis 클라이언트 생성
 */
function createRedisClient(): Redis | null {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.warn('[Redis] REDIS_URL 환경변수가 설정되지 않았습니다.');
    return null;
  }

  try {
    const client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 100, 3000);
      },
      connectTimeout: 10000,
      commandTimeout: 5000,
    });

    client.on('connect', () => {
      console.log('[Redis] 연결 성공');
    });

    client.on('error', (error) => {
      console.error('[Redis] 연결 오류:', error.message);
    });

    return client;
  } catch (error) {
    console.error('[Redis] 클라이언트 생성 실패:', error);
    return null;
  }
}

/**
 * Redis 클라이언트 인스턴스
 */
export const redis: Redis | null =
  globalThis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== 'production' && redis) {
  globalThis.redis = redis;
}

/**
 * Redis 연결 상태 확인
 */
export async function isRedisConnected(): Promise<boolean> {
  if (!redis) return false;

  try {
    await redis.ping();
    return true;
  } catch {
    return false;
  }
}

// Redis 키 상수
export const REDIS_KEYS = {
  SEARCH_RANK: 'search:rank',
  SEARCH_RANK_PREV: 'search:rank:prev',
  SEARCH_RANK_PREV_TS: 'search:rank:prev:timestamp',
  SEARCH_RANK_CACHE: 'search:rank:cache',
} as const;
