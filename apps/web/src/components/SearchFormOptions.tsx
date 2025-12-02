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

export const SearchFormOptions: React.FC<SearchFormOptionsProps> = ({
  hasRecruitment, hasActiveQuota, hasReserveQuota,
  onRecruitmentChange, onActiveQuotaChange, onReserveQuotaChange,
  isExpanded, onToggleExpanded,
}) => {
  const activeCount = [hasRecruitment, hasActiveQuota, hasReserveQuota].filter(Boolean).length;

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
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span className={cn('text-sm text-gray-600')}>추가 옵션</span>
          {activeCount > 0 && (
            <span className={cn('badge-success text-[10px] px-1.5 py-0.5')}>{activeCount}</span>
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
          <div className={cn('grid grid-cols-1 sm:grid-cols-3 gap-2')}>
            {[
              { id: 'hasRecruitment', label: '채용공고 등록업체', checked: hasRecruitment, onChange: onRecruitmentChange },
              { id: 'hasActiveQuota', label: '현역 배정인원', checked: hasActiveQuota, onChange: onActiveQuotaChange },
              { id: 'hasReserveQuota', label: '보충역 배정인원', checked: hasReserveQuota, onChange: onReserveQuotaChange },
            ].map(({ id, label, checked, onChange }) => (
              <label key={id} className={cn('flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer')}>
                <Checkbox id={id} checked={checked} onCheckedChange={(c) => onChange(c === true)} />
                <span className={cn('text-sm text-gray-600')}>{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
