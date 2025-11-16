import React from 'react';
import { Button } from 'ui';
import { SearchHistory } from './SearchHistory';
import { cn } from 'ui';

interface QuickSearchFormProps {
  companyName: string;
  searchHistory: string[];
  onCompanyNameChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onHistorySelect: (term: string) => void;
  onHistoryRemove: (term: string) => void;
}

/**
 * 빠른 검색 폼 컴포넌트
 */
export const QuickSearchForm: React.FC<QuickSearchFormProps> = ({
  companyName,
  searchHistory,
  onCompanyNameChange,
  onSubmit,
  onHistorySelect,
  onHistoryRemove,
}) => {
  return (
    <div className={cn(
      // 빠른 검색 컨테이너
      'bg-white rounded-lg shadow-lg border-t-4 border-blue-500'
    )}>
      <div className={cn('p-4 sm:p-6')}>
        <form onSubmit={onSubmit} className={cn('space-y-4')}>
          <h2 className={cn(
            // 제목 스타일
            'text-lg sm:text-xl font-semibold text-blue-800'
          )}>
            업체명으로 빠른 검색
          </h2>
          <div className={cn(
            // 입력 영역 레이아웃
            'flex flex-col sm:flex-row space-y-2 sm:space-y-0'
          )}>
            <div className={cn(
              // 입력 필드 컨테이너
              'relative flex-1'
            )}>
              <div className={cn(
                // 검색 아이콘 컨테이너
                'absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'
              )}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={cn(
                    // 아이콘 크기
                    'h-5 w-5 sm:h-6 sm:w-6 text-blue-400'
                  )} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => onCompanyNameChange(e.target.value)}
                className={cn(
                  // 입력 필드 스타일
                  'w-full pl-12 py-3 sm:py-4 border-2 border-blue-100 rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg'
                )}
                placeholder="업체명 입력 (예: 삼성전자)"
                style={{ fontSize: '17px' }}
              />
            </div>
            <Button 
              type="submit" 
              className={cn(
                // 검색 버튼 스타일
                'w-full sm:w-auto sm:ml-2 bg-blue-600 hover:bg-blue-700 text-base sm:text-lg py-3 h-auto px-6'
              )}
            >
              검색
            </Button>
          </div>
          
          {/* 검색 히스토리 */}
          <SearchHistory
            history={searchHistory}
            onSelect={onHistorySelect}
            onRemove={onHistoryRemove}
          />
        </form>
      </div>
    </div>
  );
};

