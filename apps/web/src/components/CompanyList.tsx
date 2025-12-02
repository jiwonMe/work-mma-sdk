import React from 'react';
import { Button } from 'ui';
import { SearchResult } from 'mma-sdk';
import { CompanyDetails } from '../types/company';
import { useCompanyList } from '../hooks';
import { CompanyCard } from './CompanyCard';
import { CompanyTable } from './CompanyTable';
import { Pagination } from './Pagination';
import { cn } from 'ui';

interface CompanyListProps {
  searchResult: SearchResult | null;
  loading: boolean;
  onPageChange: (page: number) => void;
}

const CompanyList: React.FC<CompanyListProps> = ({ searchResult, loading, onPageChange }) => {
  const { selectedCompany, handleCompanySelect } = useCompanyList(searchResult);

  if (loading) {
    return (
      <div className={cn('bg-white rounded-xl border border-gray-100 p-10 flex flex-col items-center justify-center')}>
        <div className={cn('w-6 h-6 border-2 border-gray-200 border-t-primary-500 rounded-full animate-spin mb-3')} />
        <p className={cn('text-sm text-gray-500')}>검색 중...</p>
      </div>
    );
  }

  if (!searchResult) {
    return null;
  }

  if (searchResult.totalCount === 0) {
    return (
      <div className={cn('bg-white rounded-xl border border-gray-100 p-10 text-center')}>
        <svg className={cn('h-10 w-10 mx-auto text-gray-200 mb-3')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
        </svg>
        <p className={cn('text-sm text-gray-600 font-medium')}>결과가 없습니다</p>
        <p className={cn('text-xs text-gray-400 mt-1')}>다른 조건으로 검색해보세요</p>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-xl border border-gray-100 overflow-hidden')}>
      {/* Header */}
      <div className={cn('px-4 py-3 border-b border-gray-100 flex items-center justify-between')}>
        <div className={cn('flex items-center gap-1.5 text-sm text-gray-600')}>
          <span className={cn('font-medium text-gray-800')}>총 {searchResult.totalCount.toLocaleString()}건</span>
          <span className={cn('text-gray-400')}>({searchResult.currentPage}/{searchResult.totalPages} 페이지)</span>
        </div>
        <div className={cn('flex items-center gap-1 text-xs text-gray-400')}>
          <span>회사명 클릭 →</span>
          <span className={cn('text-blue-500')}>wanted</span>
        </div>
      </div>

      {/* Mobile */}
      <div className={cn('block sm:hidden divide-y divide-gray-100')}>
        {searchResult.companies.map((company, index) => (
          <CompanyCard
            key={company.code || index}
            company={company}
            isSelected={selectedCompany === company}
            onSelect={handleCompanySelect}
          />
        ))}
      </div>

      {/* Desktop */}
      <CompanyTable
        searchResult={searchResult}
        selectedCompany={selectedCompany as CompanyDetails | null}
        onSelect={handleCompanySelect}
      />

      <Pagination searchResult={searchResult} onPageChange={onPageChange} />
    </div>
  );
};

export default CompanyList;
