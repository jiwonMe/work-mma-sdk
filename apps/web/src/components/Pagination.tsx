import React from 'react';
import { Button } from 'ui';
import { SearchResult } from 'mma-sdk';
import { cn } from 'ui';

interface PaginationProps {
  searchResult: SearchResult;
  onPageChange: (page: number) => void;
}

/**
 * 페이지네이션 컴포넌트
 */
export const Pagination: React.FC<PaginationProps> = ({ 
  searchResult, 
  onPageChange 
}) => {
  if (searchResult.totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn(
      // 페이지네이션 컨테이너
      'flex justify-center p-3 sm:p-4 border-t border-slate-200 overflow-x-auto'
    )}>
      <nav className={cn(
        // 네비게이션 컨테이너
        'flex items-center space-x-1'
      )} aria-label="Pagination">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={searchResult.currentPage === 1}
          className={cn(
            // 데스크톱에서만 표시
            'hidden sm:inline-flex text-xs'
          )}
        >
          처음
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(searchResult.currentPage - 1)}
          disabled={searchResult.currentPage === 1}
          className={cn(
            // 버튼 기본 스타일
            'text-xs px-2 sm:px-3'
          )}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={cn('h-3 w-3 sm:h-4 sm:w-4')} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          <span className={cn('ml-1 hidden sm:inline')}>이전</span>
        </Button>
        
        <div className={cn(
          // 페이지 번호 컨테이너
          'flex space-x-1 overflow-x-auto max-w-xs sm:max-w-none px-1 sm:px-0'
        )}>
          {(() => {
            const totalPages = searchResult.totalPages;
            const currentPage = searchResult.currentPage;
            let pageNumbers: number[] = [];
            
            // 페이지 번호 계산
            if (totalPages <= 5) {
              pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
            } else if (currentPage <= 3) {
              pageNumbers = [1, 2, 3, 4, 5];
            } else if (currentPage >= totalPages - 2) {
              pageNumbers = [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            } else {
              pageNumbers = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
            }
            
            return pageNumbers.map((pageNum) => (
              <Button
                key={pageNum}
                variant={searchResult.currentPage === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  // 페이지 번호 버튼 스타일
                  'text-xs px-2 sm:px-3',
                  // 현재 페이지는 클릭 비활성화
                  searchResult.currentPage === pageNum ? 'pointer-events-none' : ''
                )}
              >
                {pageNum}
              </Button>
            ));
          })()}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(searchResult.currentPage + 1)}
          disabled={searchResult.currentPage === searchResult.totalPages}
          className={cn('text-xs px-2 sm:px-3')}
        >
          <span className={cn('mr-1 hidden sm:inline')}>다음</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={cn('h-3 w-3 sm:h-4 sm:w-4')} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(searchResult.totalPages)}
          disabled={searchResult.currentPage === searchResult.totalPages}
          className={cn('hidden sm:inline-flex text-xs')}
        >
          마지막
        </Button>
      </nav>
    </div>
  );
};

