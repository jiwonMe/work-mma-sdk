import { NextResponse } from 'next/server';
import { redis, REDIS_KEYS } from '@/lib/redis';

/**
 * 인기 검색어 조회 API
 * GET /api/search-rank
 */

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const CACHE_TTL = 60;
const SNAPSHOT_INTERVAL = 5 * 60 * 1000;

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

async function calculateRankChanges(
  currentRankings: string[]
): Promise<Map<string, { change: RankItem['change']; amount?: number }>> {
  const changes = new Map<string, { change: RankItem['change']; amount?: number }>();

  if (!redis) {
    currentRankings.forEach((k) => changes.set(k, { change: 'same' }));
    return changes;
  }

  try {
    const prevRankings = await redis.zrevrange(REDIS_KEYS.SEARCH_RANK_PREV, 0, -1);
    const prevRankMap = new Map<string, number>();
    prevRankings.forEach((k, i) => prevRankMap.set(k, i + 1));

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
    currentRankings.forEach((k) => changes.set(k, { change: 'same' }));
  }

  return changes;
}

async function saveRankSnapshot(rankings: string[]): Promise<void> {
  if (!redis || rankings.length === 0) return;

  try {
    const lastSnapshot = await redis.get(REDIS_KEYS.SEARCH_RANK_PREV_TS);
    const now = Date.now();

    if (lastSnapshot && now - parseInt(lastSnapshot) < SNAPSHOT_INTERVAL) return;

    const pipeline = redis.pipeline();
    pipeline.del(REDIS_KEYS.SEARCH_RANK_PREV);

    rankings.forEach((keyword, index) => {
      pipeline.zadd(REDIS_KEYS.SEARCH_RANK_PREV, rankings.length - index, keyword);
    });

    pipeline.set(REDIS_KEYS.SEARCH_RANK_PREV_TS, now.toString());
    await pipeline.exec();
  } catch (error) {
    console.error('[search-rank] 스냅샷 저장 오류:', error);
  }
}

export async function GET(request: Request) {
  try {
    if (!redis) {
      return NextResponse.json<SearchRankResponse>(
        { success: false, rankings: [], updatedAt: new Date().toISOString(), error: 'Redis가 연결되지 않았습니다.' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = Math.min(Math.max(1, parseInt(limitParam || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT), MAX_LIMIT);

    // 캐시 확인
    const cached = await redis.get(REDIS_KEYS.SEARCH_RANK_CACHE);
    if (cached) {
      return NextResponse.json<SearchRankResponse>(JSON.parse(cached), {
        headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
      });
    }

    const keywords = await redis.zrevrange(REDIS_KEYS.SEARCH_RANK, 0, limit - 1);
    const changes = await calculateRankChanges(keywords);

    const rankings: RankItem[] = keywords.map((keyword, index) => {
      const changeInfo = changes.get(keyword) || { change: 'same' as const };
      return { rank: index + 1, keyword, change: changeInfo.change, changeAmount: changeInfo.amount };
    });

    const response: SearchRankResponse = {
      success: true,
      rankings,
      updatedAt: new Date().toISOString(),
    };

    await redis.setex(REDIS_KEYS.SEARCH_RANK_CACHE, CACHE_TTL, JSON.stringify(response));
    saveRankSnapshot(keywords).catch(() => {});

    return NextResponse.json<SearchRankResponse>(response, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
    });
  } catch (error) {
    console.error('[search-rank] 조회 오류:', error);
    return NextResponse.json<SearchRankResponse>(
      { success: false, rankings: [], updatedAt: new Date().toISOString(), error: '검색 순위 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}
