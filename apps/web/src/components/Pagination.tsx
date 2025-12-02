import React from 'react';
import { Button } from 'ui';
import { SearchResult } from 'mma-sdk';
import { cn } from 'ui';

interface PaginationProps {
  searchResult: SearchResult;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ searchResult, onPageChange }) => {
  if (searchResult.totalPages <= 1) return null;

  const { currentPage, totalPages } = searchResult;
  let pages: number[] = [];

  if (totalPages <= 5) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else if (currentPage <= 3) {
    pages = [1, 2, 3, 4, 5];
  } else if (currentPage >= totalPages - 2) {
    pages = [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  } else {
    pages = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  }

  return (
    <div className={cn('flex justify-center items-center gap-1 py-3 border-t border-gray-100')}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <svg className={cn('h-4 w-4')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </Button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            'min-w-[32px] h-8 px-2 text-sm rounded transition-colors',
            currentPage === page
              ? 'bg-primary-500 text-white font-medium'
              : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          {page}
        </button>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <svg className={cn('h-4 w-4')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </div>
  );
};
