import { NextResponse } from 'next/server';
import { kv, REDIS_KEYS } from '@/lib/redis';

/**
 * 검색어 기록 API
 * POST /api/search-rank/record
 * 
 * Vercel KV Sorted Set을 사용하여 검색어 빈도를 집계합니다.
 * - 시간 가중치: 최근 검색어에 더 높은 점수 부여
 * - 정규화: 검색어 앞뒤 공백 제거
 */

// 점수 계산을 위한 상수
const BASE_SCORE = 1;
const TIME_WEIGHT_FACTOR = 0.001;

// 검색어 최대 길이
const MAX_KEYWORD_LENGTH = 100;

interface RecordRequestBody {
  keyword: string;
}

/**
 * 검색어 정규화
 */
function normalizeKeyword(keyword: string): string | null {
  if (!keyword || typeof keyword !== 'string') {
    return null;
  }

  const normalized = keyword.trim();

  if (normalized.length === 0 || normalized.length > MAX_KEYWORD_LENGTH) {
    return null;
  }

  return normalized;
}

/**
 * 시간 기반 점수 계산
 * 최근 검색어에 더 높은 가중치 부여
 */
function calculateScore(): number {
  const now = Date.now();
  const timeWeight = now * TIME_WEIGHT_FACTOR;
  return BASE_SCORE + timeWeight;
}

export async function POST(request: Request) {
  try {
    // 요청 본문 파싱
    const body: RecordRequestBody = await request.json();
    const keyword = normalizeKeyword(body.keyword);

    if (!keyword) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 검색어입니다.' },
        { status: 400 }
      );
    }

    // 점수 계산
    const score = calculateScore();

    // Vercel KV Sorted Set에 검색어 추가/업데이트
    // zincrby: 기존 점수에 새 점수를 더함 (누적)
    await kv.zincrby(REDIS_KEYS.SEARCH_RANK, score, keyword);

    return NextResponse.json({
      success: true,
      keyword,
    });
  } catch (error) {
    console.error('[search-rank/record] 오류:', error);

    return NextResponse.json(
      { success: false, error: '검색어 기록에 실패했습니다.' },
      { status: 500 }
    );
  }
}
