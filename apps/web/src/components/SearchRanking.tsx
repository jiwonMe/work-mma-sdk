'use client';

import React from 'react';
import { cn } from 'ui';
import { useSearchRanking, RankItem } from '../hooks/useSearchRanking';

/**
 * 순위 변동 아이콘
 */
function RankChangeIndicator({ change, amount }: { change: RankItem['change']; amount?: number }) {
  switch (change) {
    case 'up':
      return (
        <span className={cn('flex items-center gap-0.5 text-[11px] font-medium text-rose-500')}>
          <svg className={cn('w-3 h-3')} viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 4l4 4H9v4H7V8H4l4-4z" />
          </svg>
          {amount}
        </span>
      );
    case 'down':
      return (
        <span className={cn('flex items-center gap-0.5 text-[11px] font-medium text-blue-500')}>
          <svg className={cn('w-3 h-3')} viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 12l-4-4h3V4h2v4h3l-4 4z" />
          </svg>
          {amount}
        </span>
      );
    case 'new':
      return (
        <span className={cn('text-[10px] font-semibold text-orange-500')}>
          NEW
        </span>
      );
    default:
      return null;
  }
}

/**
 * 순위 숫자 표시
 */
function RankIcon({ rank }: { rank: number }) {
  return (
    <span className={cn(
      // 폰트
      'text-xs font-semibold tabular-nums',
      // 순위별 색상
      rank === 1 && 'text-orange-500',
      rank === 2 && 'text-gray-400',
      rank === 3 && 'text-amber-600',
      rank > 3 && 'text-gray-400'
    )}>
      {rank}
    </span>
  );
}

/**
 * 로딩 스켈레톤
 */
function RankingSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className={cn('space-y-1')}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn('flex items-center gap-3 px-3 py-2.5 animate-pulse')}>
          <div className={cn('w-6 h-6 bg-gray-100 rounded-md')} />
          <div className={cn('flex-1 h-4 bg-gray-100 rounded')} />
        </div>
      ))}
    </div>
  );
}

/**
 * 순위 아이템 컴포넌트 (세로)
 */
function RankItemRow({ item, onClick }: { item: RankItem; onClick: (keyword: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onClick(item.keyword)}
      className={cn(
        // 레이아웃
        'group flex items-center gap-3 w-full px-3 py-2.5',
        // 스타일
        'rounded-lg transition-colors duration-150',
        // 호버
        'hover:bg-gray-100'
      )}
    >
      <RankIcon rank={item.rank} />
      <span className={cn('flex-1 text-left text-sm text-gray-700')}>
        {item.keyword}
      </span>
      <RankChangeIndicator change={item.change} amount={item.changeAmount} />
      <span className={cn(
        'opacity-0 group-hover:opacity-100 transition-opacity text-gray-300'
      )}>
        <svg className={cn('w-4 h-4')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </button>
  );
}

/**
 * 마퀴 아이템 (흘러가는 효과용)
 */
function MarqueeItem({ item, onClick }: { item: RankItem; onClick: (keyword: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onClick(item.keyword)}
      className={cn(
        // 레이아웃
        'inline-flex items-center gap-1.5 px-3 py-1',
        // 호버
        'hover:text-gray-900',
        // 전환
        'transition-colors duration-150 whitespace-nowrap'
      )}
    >
      <RankIcon rank={item.rank} />
      <span className={cn('text-sm text-gray-600')}>
        {item.keyword}
      </span>
      <RankChangeIndicator change={item.change} amount={item.changeAmount} />
    </button>
  );
}

/**
 * 검색 순위 컴포넌트 Props
 */
interface SearchRankingProps {
  onSelect: (keyword: string) => void;
  variant?: 'horizontal' | 'vertical';
  limit?: number;
  className?: string;
  title?: string;
}

/**
 * 검색 순위 메인 컴포넌트
 */
export function SearchRanking({
  onSelect,
  variant = 'vertical',
  limit = 10,
  className,
  title = '인기 검색',
}: SearchRankingProps) {
  const { rankings, loading, error, updatedAt } = useSearchRanking({
    limit,
    pollingInterval: 30000,
  });

  const isHorizontal = variant === 'horizontal';

  // 에러 또는 빈 데이터 시 렌더링 하지 않음
  if (error || (!loading && rankings.length === 0)) {
    return null;
  }

  // 가로 레이아웃 (마퀴 애니메이션)
  if (isHorizontal) {
    return (
      <div className={cn('space-y-2', className)}>
        {/* 섹션 헤더 */}
        <div className={cn('flex items-center gap-2 px-1')}>
          <span className={cn('text-xs font-medium text-gray-400')}>
            {title}
          </span>
          <span className={cn('w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse')} />
        </div>

        {/* 마퀴 컨테이너 */}
        {loading ? (
          <div className={cn('flex gap-2 overflow-hidden')}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={cn('w-24 h-8 bg-gray-100 rounded-full animate-pulse flex-shrink-0')} />
            ))}
          </div>
        ) : (
          <div className={cn('relative overflow-hidden')}>
            {/* 좌우 페이드 그라디언트 */}
            <div className={cn(
              'absolute left-0 top-0 bottom-0 w-8 z-10',
              'bg-gradient-to-r from-[#fafafa] to-transparent pointer-events-none'
            )} />
            <div className={cn(
              'absolute right-0 top-0 bottom-0 w-8 z-10',
              'bg-gradient-to-l from-[#fafafa] to-transparent pointer-events-none'
            )} />

            {/* 마퀴 트랙 */}
            <div className={cn('flex animate-marquee')}>
              {/* 첫 번째 세트 */}
              {rankings.slice(0, limit).map((item) => (
                <MarqueeItem key={`a-${item.keyword}`} item={item} onClick={onSelect} />
              ))}
              {/* 두 번째 세트 (무한 루프용) */}
              {rankings.slice(0, limit).map((item) => (
                <MarqueeItem key={`b-${item.keyword}`} item={item} onClick={onSelect} />
              ))}
            </div>
          </div>
        )}

        {/* 마퀴 CSS 애니메이션 */}
        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    );
  }

  // 세로 레이아웃
  return (
    <div className={cn(className)}>
      {/* 섹션 헤더 */}
      <div className={cn('flex items-center justify-between px-1 py-2')}>
        <span className={cn('text-xs font-medium text-gray-400')}>
          {title}
        </span>
        {updatedAt && (
          <span className={cn('text-[10px] text-gray-300')}>
            {updatedAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {/* 순위 목록 */}
      <div>
        {loading ? (
          <RankingSkeleton count={limit} />
        ) : (
          rankings.slice(0, limit).map((item) => (
            <RankItemRow key={item.keyword} item={item} onClick={onSelect} />
          ))
        )}
      </div>
    </div>
  );
}
