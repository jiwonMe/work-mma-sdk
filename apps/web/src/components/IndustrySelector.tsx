import React from 'react';
import { Button, Checkbox } from 'ui';
import { IndustryType } from 'mma-sdk';
import { cn } from 'ui';

interface IndustrySelectorProps {
  industries: IndustryType[];
  selectedIndustries: string[];
  isLoading: boolean;
  onToggle: (code: string) => void;
  onToggleAll: () => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

/**
 * 업종 선택 컴포넌트
 */
export const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  industries,
  selectedIndustries,
  isLoading,
  onToggle,
  onToggleAll,
  isExpanded,
  onToggleExpanded,
}) => {
  const allSelected = selectedIndustries.length === industries.length;

  return (
    <div className={cn(
      // 업종 선택 컨테이너
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
          )}>업종선택</span>
          <span className={cn(
            // 기본값 안내 (데스크톱만)
            'ml-2 text-xs text-green-600 font-normal hidden sm:inline'
          )}>(기본값: 전체 선택됨)</span>
          {selectedIndustries.length > 0 && selectedIndustries.length < industries.length && (
            <span className={cn(
              // 선택 개수 배지
              'ml-2 px-1.5 py-0.5 sm:px-2 bg-blue-100 text-blue-800 text-xs rounded-full'
            )}>
              {selectedIndustries.length}/{industries.length}
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
          <div className={cn('flex justify-end mb-2')}>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={onToggleAll}
              className={cn(
                // 전체 선택/해제 버튼
                'text-xs',
                allSelected ? 'bg-slate-100' : ''
              )}
            >
              {allSelected ? "전체 해제" : "전체 선택"}
            </Button>
          </div>
          
          <div className={cn(
            // 업종 리스트 그리드
            'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-2 p-2 sm:p-4 border border-slate-200 rounded-md max-h-60 overflow-y-auto'
          )}>
            {industries.length > 0 ? (
              <>
                {allSelected && (
                  <div className={cn(
                    // 전체 선택 알림
                    'col-span-full bg-green-50 rounded-md p-2 mb-2 text-xs sm:text-sm text-green-700 flex items-center'
                  )}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={cn('h-4 w-4 sm:h-5 sm:w-5 mr-1')} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                    모든 업종이 선택되었습니다
                  </div>
                )}
                {industries.map((industry) => (
                  <div 
                    key={industry.code} 
                    className={cn(
                      // 업종 항목 컨테이너
                      'flex items-center space-x-2 p-1.5 sm:p-2 rounded hover:bg-slate-50'
                    )}
                  >
                    <Checkbox
                      id={`industry-${industry.code}`}
                      checked={selectedIndustries.includes(industry.code)}
                      onCheckedChange={() => onToggle(industry.code)}
                      className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4')}
                    />
                    <label 
                      htmlFor={`industry-${industry.code}`} 
                      className={cn(
                        // 레이블 스타일
                        'text-xs sm:text-sm cursor-pointer truncate'
                      )}
                    >
                      {industry.name}
                    </label>
                  </div>
                ))}
              </>
            ) : (
              <p className={cn(
                // 빈 상태 메시지
                'text-slate-500 text-xs sm:text-sm'
              )}>
                {isLoading ? '업종을 불러오는 중...' : '복무형태를 선택하면 업종이 표시됩니다.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

