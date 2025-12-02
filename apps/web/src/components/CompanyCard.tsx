import React from 'react';
import { Company } from 'mma-sdk';
import { CompanyDetails } from '../types/company';
import { getWantedSearchUrl } from '../utils/company';
import { CompanyDetailsView } from './CompanyDetails';
import { cn } from 'ui';

interface CompanyCardProps {
  company: Company;
  isSelected: boolean;
  onSelect: (company: Company) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company, isSelected, onSelect }) => {
  return (
    <div className={cn('p-4')}>
      <div className={cn('flex justify-between items-start')}>
        <div className={cn('min-w-0 flex-1')}>
          <a
            href={getWantedSearchUrl(company.name)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn('text-sm font-medium text-gray-800 hover:text-primary-600 transition-colors')}
          >
            {company.name}
          </a>
          <p className={cn('text-xs text-gray-400 mt-0.5')}>{company.regionalOffice || '-'}</p>
        </div>
        <div className={cn('flex items-center gap-2 ml-3')}>
          {company.isRecruiting && (
            <span className={cn('badge-success')}>모집중</span>
          )}
          <button
            onClick={() => onSelect(company)}
            className={cn('p-1 rounded hover:bg-gray-100 transition-colors')}
          >
            <svg
              className={cn('h-4 w-4 text-gray-400 transition-transform', isSelected && 'rotate-180 text-primary-500')}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      {isSelected && <CompanyDetailsView company={company as CompanyDetails} isMobile />}
    </div>
  );
};
