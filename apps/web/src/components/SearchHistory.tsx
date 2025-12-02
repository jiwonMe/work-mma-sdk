import React from 'react';
import { cn } from 'ui';

interface SearchHistoryProps {
  history: string[];
  onSelect: (term: string) => void;
  onRemove: (term: string) => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({ history, onSelect, onRemove }) => {
  if (history.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5')}>
      <span className={cn('text-xs text-gray-400')}>최근</span>
      {history.map((term, index) => (
        <div 
          key={`${term}-${index}`}
          onClick={() => onSelect(term)}
          className={cn(
            'group flex items-center gap-1 px-2 py-1',
            'bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-600',
            'cursor-pointer transition-colors'
          )}
        >
          <span>{term}</span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(term); }}
            className={cn('p-0.5 rounded hover:bg-gray-300 text-gray-400 hover:text-gray-600')}
          >
            <svg className={cn('h-3 w-3')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};
