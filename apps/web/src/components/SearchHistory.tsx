import React from 'react';
import { cn } from 'ui';

interface SearchHistoryProps {
  history: string[];
  onSelect: (term: string) => void;
  onRemove: (term: string) => void;
}

/**
 * 검색 히스토리 컴포넌트
 */
export const SearchHistory: React.FC<SearchHistoryProps> = ({ 
  history, 
  onSelect, 
  onRemove 
}) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      // 히스토리 컨테이너
      'flex flex-wrap gap-2 mt-3'
    )}>
      {history.map((term, index) => (
        <div 
          key={`${term}-${index}`}
          onClick={() => onSelect(term)}
          className={cn(
            // 히스토리 칩 스타일
            'flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm cursor-pointer hover:bg-blue-100 transition-colors'
          )}
        >
          <span>{term}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(term);
            }}
            className={cn(
              // 삭제 버튼 스타일
              'ml-1.5 p-0.5 rounded-full hover:bg-blue-200 focus:outline-none'
            )}
            aria-label={`Remove ${term}`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={cn('h-3.5 w-3.5')} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

