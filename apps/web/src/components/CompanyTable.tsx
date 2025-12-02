import React from 'react';
import { Company, SearchResult } from 'mma-sdk';
import { CompanyDetails } from '../types/company';
import { getWantedSearchUrl } from '../utils/company';
import { CompanyDetailsView } from './CompanyDetails';
import { cn } from 'ui';

interface CompanyTableProps {
  searchResult: SearchResult;
  selectedCompany: CompanyDetails | null;
  onSelect: (company: Company) => void;
}

export const CompanyTable: React.FC<CompanyTableProps> = ({ searchResult, selectedCompany, onSelect }) => {
  return (
    <div className={cn('hidden sm:block')}>
      <table className={cn('w-full')}>
        <thead>
          <tr className={cn('border-b border-gray-100 bg-gray-50/50')}>
            <th className={cn('py-2.5 px-4 text-left text-xs font-medium text-gray-500')}>업체명</th>
            <th className={cn('py-2.5 px-4 text-center text-xs font-medium text-gray-500 hidden md:table-cell')}>선정년도</th>
            <th className={cn('py-2.5 px-4 text-center text-xs font-medium text-gray-500')}>지방청</th>
            <th className={cn('py-2.5 px-4 text-center text-xs font-medium text-gray-500')}>채용</th>
            <th className={cn('py-2.5 px-4 w-12')}></th>
          </tr>
        </thead>
        <tbody className={cn('divide-y divide-gray-100')}>
          {searchResult.companies.map((company: Company, index) => (
            <React.Fragment key={company.code || index}>
              <tr className={cn('hover:bg-gray-50/50 transition-colors', selectedCompany === company && 'bg-primary-50/50')}>
                <td className={cn('py-2.5 px-4')}>
                  <a
                    href={getWantedSearchUrl(company.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn('text-sm text-gray-800 hover:text-primary-600 transition-colors')}
                  >
                    {company.name}
                  </a>
                </td>
                <td className={cn('py-2.5 px-4 text-center text-sm text-gray-500 hidden md:table-cell')}>
                  {company.selectionYear || '-'}
                </td>
                <td className={cn('py-2.5 px-4 text-center text-sm text-gray-500')}>
                  {company.regionalOffice || '-'}
                </td>
                <td className={cn('py-2.5 px-4 text-center')}>
                  {company.isRecruiting ? (
                    <span className={cn('badge-success')}>모집중</span>
                  ) : (
                    <span className={cn('text-sm text-gray-400')}>-</span>
                  )}
                </td>
                <td className={cn('py-2.5 px-4 text-center')}>
                  <button
                    onClick={() => onSelect(company)}
                    className={cn('p-1 rounded hover:bg-gray-100 transition-colors')}
                  >
                    <svg
                      className={cn('h-4 w-4 text-gray-400 transition-transform', selectedCompany === company && 'rotate-180 text-primary-500')}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </td>
              </tr>
              {selectedCompany === company && (
                <tr>
                  <td colSpan={5} className={cn('bg-gray-50/50 px-4 py-3')}>
                    <CompanyDetailsView company={selectedCompany} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
