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

export const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  industries, selectedIndustries, isLoading,
  onToggle, onToggleAll, isExpanded, onToggleExpanded,
}) => {
  const allSelected = selectedIndustries.length === industries.length && industries.length > 0;
  const someSelected = selectedIndustries.length > 0;

  return (
    <div className={cn('border border-gray-100 rounded-lg overflow-hidden')}>
      <button
        type="button"
        onClick={onToggleExpanded}
        className={cn(
          'w-full px-3 py-2.5 flex justify-between items-center',
          'bg-gray-50/50 hover:bg-gray-50 transition-colors text-left'
        )}
      >
        <div className={cn('flex items-center gap-2')}>
          <svg className={cn('h-4 w-4 text-gray-400')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span className={cn('text-sm text-gray-600')}>업종선택</span>
          {someSelected && (
            <span className={cn('badge-success text-[10px] px-1.5 py-0.5')}>
              {allSelected ? '전체' : `${selectedIndustries.length}개`}
            </span>
          )}
        </div>
        <svg
          className={cn('h-4 w-4 text-gray-400 transition-transform', isExpanded && 'rotate-180')}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className={cn('px-3 py-3 border-t border-gray-100 animate-fade-in')}>
          <div className={cn('flex justify-end mb-2')}>
            <Button type="button" variant="ghost" size="sm" onClick={onToggleAll}>
              {allSelected ? '전체 해제' : '전체 선택'}
            </Button>
          </div>
          <div className={cn('grid grid-cols-2 sm:grid-cols-3 gap-1 max-h-48 overflow-y-auto')}>
            {isLoading ? (
              <p className={cn('text-sm text-gray-400 col-span-full py-2')}>불러오는 중...</p>
            ) : industries.length > 0 ? (
              industries.map((industry) => (
                <label
                  key={industry.code}
                  className={cn('flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer')}
                >
                  <Checkbox
                    checked={selectedIndustries.includes(industry.code)}
                    onCheckedChange={() => onToggle(industry.code)}
                  />
                  <span className={cn('text-sm text-gray-600 truncate')}>{industry.name}</span>
                </label>
              ))
            ) : (
              <p className={cn('text-sm text-gray-400 col-span-full py-2')}>복무형태를 선택하세요</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
