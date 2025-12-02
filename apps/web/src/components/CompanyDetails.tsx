import React from 'react';
import { CompanyDetails } from '../types/company';
import { getWantedSearchUrl } from '../utils/company';
import { cn } from 'ui';

interface CompanyDetailsProps {
  company: CompanyDetails;
  isMobile?: boolean;
}

export const CompanyDetailsView: React.FC<CompanyDetailsProps> = ({ company, isMobile = false }) => {
  const Item = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div>
      <p className={cn('text-xs text-gray-400 mb-0.5')}>{label}</p>
      <p className={cn('text-sm text-gray-700')}>{value || '-'}</p>
    </div>
  );

  if (isMobile) {
    return (
      <div className={cn('mt-3 pt-3 border-t border-gray-100 animate-fade-in')}>
        <div className={cn('grid grid-cols-2 gap-3 text-xs')}>
          <Item label="업체 코드" value={company.code} />
          <Item label="선정년도" value={company.selectionYear} />
          <div className={cn('col-span-2')}>
            <Item label="소재지" value={company.address} />
          </div>
          <Item label="현역 배정" value={company.activeQuota} />
          <Item label="보충역 배정" value={company.reserveQuota} />
          <div className={cn('col-span-2')}>
            <Item label="업종" value={company.industryType} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('animate-fade-in')}>
      <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4')}>
        <Item label="업체 코드" value={company.code} />
        <Item label="선정년도" value={company.selectionYear} />
        <Item label="현역 배정" value={company.activeQuota} />
        <Item label="보충역 배정" value={company.reserveQuota} />
        <div className={cn('col-span-2')}>
          <Item label="소재지" value={company.address} />
        </div>
        <div className={cn('col-span-2')}>
          <Item label="업종" value={company.industryType} />
        </div>
      </div>
    </div>
  );
};
