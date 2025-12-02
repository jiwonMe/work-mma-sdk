import { NextResponse } from 'next/server';
import { redis, REDIS_KEYS } from '@/lib/redis';

/**
 * 검색어 기록 API
 * POST /api/search-rank/record
 */

const BASE_SCORE = 1;
const TIME_WEIGHT_FACTOR = 0.001;
const MAX_KEYWORD_LENGTH = 100;

interface RecordRequestBody {
  keyword: string;
}

function normalizeKeyword(keyword: string): string | null {
  if (!keyword || typeof keyword !== 'string') return null;
  const normalized = keyword.trim();
  if (normalized.length === 0 || normalized.length > MAX_KEYWORD_LENGTH) return null;
  return normalized;
}

function calculateScore(): number {
  return BASE_SCORE + Date.now() * TIME_WEIGHT_FACTOR;
}

export async function POST(request: Request) {
  try {
    if (!redis) {
      return NextResponse.json(
        { success: false, error: 'Redis가 연결되지 않았습니다.' },
        { status: 503 }
      );
    }

    const body: RecordRequestBody = await request.json();
    const keyword = normalizeKeyword(body.keyword);

    if (!keyword) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 검색어입니다.' },
        { status: 400 }
      );
    }

    const score = calculateScore();
    await redis.zincrby(REDIS_KEYS.SEARCH_RANK, score, keyword);

    return NextResponse.json({ success: true, keyword });
  } catch (error) {
    console.error('[search-rank/record] 오류:', error);
    return NextResponse.json(
      { success: false, error: '검색어 기록에 실패했습니다.' },
      { status: 500 }
    );
  }
}
