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

export const QuickSearchForm: React.FC<QuickSearchFormProps> = ({
  companyName,
  searchHistory,
  onCompanyNameChange,
  onSubmit,
  onHistorySelect,
  onHistoryRemove,
}) => {
  return (
    <form onSubmit={onSubmit} className={cn('space-y-3')}>
      <div className={cn('flex gap-2')}>
        <div className={cn('relative flex-1')}>
          <div className={cn('absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none')}>
            <svg className={cn('h-4 w-4 text-gray-300')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
            className={cn(
              'w-full pl-9 pr-3 py-2 h-9',
              'bg-gray-50 border border-gray-200 rounded-lg',
              'text-sm text-gray-800 placeholder:text-gray-400',
              'focus:outline-none focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10',
              'transition-all'
            )}
            placeholder="업체명을 입력하세요"
          />
        </div>
        <Button type="submit">검색</Button>
      </div>
      <SearchHistory
        history={searchHistory}
        onSelect={onHistorySelect}
        onRemove={onHistoryRemove}
      />
    </form>
  );
};
