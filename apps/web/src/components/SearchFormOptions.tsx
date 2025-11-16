import React from 'react';
import { Checkbox } from 'ui';
import { cn } from 'ui';

interface SearchFormOptionsProps {
  hasRecruitment: boolean;
  hasActiveQuota: boolean;
  hasReserveQuota: boolean;
  onRecruitmentChange: (checked: boolean) => void;
  onActiveQuotaChange: (checked: boolean) => void;
  onReserveQuotaChange: (checked: boolean) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

/**
 * 검색 옵션 컴포넌트 (채용, 배정인원 등)
 */
export const SearchFormOptions: React.FC<SearchFormOptionsProps> = ({
  hasRecruitment,
  hasActiveQuota,
  hasReserveQuota,
  onRecruitmentChange,
  onActiveQuotaChange,
  onReserveQuotaChange,
  isExpanded,
  onToggleExpanded,
}) => {
  return (
    <div className={cn(
      // 옵션 컨테이너
      'border border-slate-200 rounded-md overflow-hidden'
    )}>
      <button
        type="button"
        className={cn(
          // 헤더 버튼 스타일
          'w-full px-3 py-2 sm:px-4 sm:py-3 flex justify-between items-center bg-slate-50 hover:bg-slate-100 text-left transition-colors'
        )}
        onClick={onToggleExpanded}
      >
        <div className={cn('flex items-center')}>
          <span className={cn(
            // 레이블 텍스트
            'text-xs sm:text-sm font-medium'
          )}>추가 옵션</span>
          {(hasRecruitment || hasActiveQuota || hasReserveQuota) && (
            <span className={cn(
              // 선택된 옵션 배지
              'ml-2 px-1.5 py-0.5 sm:px-2 bg-blue-100 text-blue-800 text-xs rounded-full'
            )}>
              {[
                hasRecruitment && '채용중',
                hasActiveQuota && '현역',
                hasReserveQuota && '보충역'
              ].filter(Boolean).join(', ')}
            </span>
          )}
        </div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={cn(
            // 화살표 아이콘
            'h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200',
            // 확장 시 회전
            isExpanded ? 'transform rotate-180' : ''
          )} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </button>
      
      {isExpanded && (
        <div className={cn(
          // 확장 영역
          'p-3 sm:p-4 border-t border-slate-200'
        )}>
          <div className={cn(
            // 옵션 그리드
            'flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4'
          )}>
            <div className={cn(
              // 옵션 항목 컨테이너
              'flex items-center space-x-2 bg-slate-50 p-2 rounded-md'
            )}>
              <Checkbox
                id="hasRecruitment"
                checked={hasRecruitment}
                onCheckedChange={(checked) => onRecruitmentChange(checked === true)}
                className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4')}
              />
              <label htmlFor="hasRecruitment" className={cn('text-xs sm:text-sm')}>
                채용공고 등록업체
              </label>
            </div>
            <div className={cn('flex items-center space-x-2 bg-slate-50 p-2 rounded-md')}>
              <Checkbox
                id="hasActiveQuota"
                checked={hasActiveQuota}
                onCheckedChange={(checked) => onActiveQuotaChange(checked === true)}
                className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4')}
              />
              <label htmlFor="hasActiveQuota" className={cn('text-xs sm:text-sm')}>
                현역 배정인원
              </label>
            </div>
            <div className={cn('flex items-center space-x-2 bg-slate-50 p-2 rounded-md')}>
              <Checkbox
                id="hasReserveQuota"
                checked={hasReserveQuota}
                onCheckedChange={(checked) => onReserveQuotaChange(checked === true)}
                className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4')}
              />
              <label htmlFor="hasReserveQuota" className={cn('text-xs sm:text-sm')}>
                보충역 배정인원
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

