'use client';

import React from 'react';
import { cn } from 'ui';
import { useSearchRanking, RankItem } from '../hooks/useSearchRanking';

/**
 * 순위 변동 아이콘 컴포넌트
 */
function RankChangeIcon({ change, amount }: { change: RankItem['change']; amount?: number }) {
  switch (change) {
    case 'up':
      return (
        <span className={cn('flex items-center text-red-500 text-[10px] font-medium')}>
          <svg className={cn('w-3 h-3')} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          {amount && <span>{amount}</span>}
        </span>
      );
    case 'down':
      return (
        <span className={cn('flex items-center text-blue-500 text-[10px] font-medium')}>
          <svg className={cn('w-3 h-3')} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          {amount && <span>{amount}</span>}
        </span>
      );
    case 'new':
      return (
        <span className={cn(
          // 배지 스타일
          'px-1 py-0.5 rounded text-[9px] font-bold',
          // 색상
          'bg-primary-100 text-primary-600'
        )}>
          NEW
        </span>
      );
    default:
      return (
        <span className={cn('w-3 h-3 text-gray-300 flex items-center justify-center')}>
          -
        </span>
      );
  }
}

/**
 * 로딩 스켈레톤
 */
function RankingSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className={cn('space-y-2')}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            // 레이아웃
            'flex items-center gap-2 px-2 py-1.5',
            // 애니메이션
            'animate-pulse'
          )}
        >
          <div className={cn('w-4 h-4 bg-gray-200 rounded')} />
          <div className={cn('flex-1 h-4 bg-gray-200 rounded')} />
          <div className={cn('w-6 h-3 bg-gray-100 rounded')} />
        </div>
      ))}
    </div>
  );
}

/**
 * 검색 순위 아이템 컴포넌트
 */
interface RankItemProps {
  item: RankItem;
  onClick: (keyword: string) => void;
  variant: 'horizontal' | 'vertical';
}

function RankItemComponent({ item, onClick, variant }: RankItemProps) {
  const isHorizontal = variant === 'horizontal';

  return (
    <button
      type="button"
      onClick={() => onClick(item.keyword)}
      className={cn(
        // 기본 스타일
        'group flex items-center gap-2 transition-colors cursor-pointer',
        // 호버 효과
        'hover:bg-gray-50 rounded-md',
        // 패딩
        isHorizontal ? 'px-2 py-1' : 'px-2 py-1.5 w-full'
      )}
    >
      {/* 순위 번호 */}
      <span
        className={cn(
          // 기본 스타일
          'flex-shrink-0 text-xs font-bold tabular-nums',
          // 순위별 색상
          item.rank === 1 && 'text-primary-600',
          item.rank === 2 && 'text-primary-500',
          item.rank === 3 && 'text-primary-400',
          item.rank > 3 && 'text-gray-400',
          // 크기
          'w-4 text-center'
        )}
      >
        {item.rank}
      </span>

      {/* 검색어 */}
      <span
        className={cn(
          // 기본 스타일
          'text-sm text-gray-700 truncate',
          // 호버 효과
          'group-hover:text-gray-900',
          // 최대 너비
          isHorizontal ? 'max-w-[100px]' : 'flex-1 text-left'
        )}
      >
        {item.keyword}
      </span>

      {/* 순위 변동 */}
      <RankChangeIcon change={item.change} amount={item.changeAmount} />
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
  title = '실시간 인기 검색어',
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

  return (
    <div
      className={cn(
        // 컨테이너 스타일
        'bg-white',
        // 가로/세로 레이아웃
        isHorizontal ? '' : 'rounded-lg border border-gray-100 p-3',
        className
      )}
    >
      {/* 헤더 */}
      <div
        className={cn(
          // 레이아웃
          'flex items-center justify-between',
          // 마진
          isHorizontal ? 'mb-2' : 'mb-3'
        )}
      >
        <h3
          className={cn(
            // 텍스트 스타일
            'text-xs font-medium text-gray-500'
          )}
        >
          {title}
        </h3>
        {updatedAt && !isHorizontal && (
          <span className={cn('text-[10px] text-gray-300')}>
            {updatedAt.toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>

      {/* 로딩 상태 */}
      {loading ? (
        <RankingSkeleton count={isHorizontal ? 5 : limit} />
      ) : (
        <div
          className={cn(
            // 레이아웃
            isHorizontal
              ? 'flex flex-wrap items-center gap-1'
              : 'space-y-0.5'
          )}
        >
          {rankings.slice(0, isHorizontal ? 5 : limit).map((item) => (
            <RankItemComponent
              key={item.keyword}
              item={item}
              onClick={onSelect}
              variant={variant}
            />
          ))}
        </div>
      )}
    </div>
  );
}

