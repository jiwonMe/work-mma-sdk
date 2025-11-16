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

/**
 * 업체 목록 컴포넌트 (메인 컨테이너)
 */
const CompanyList: React.FC<CompanyListProps> = ({ 
  searchResult, 
  loading, 
  onPageChange 
}) => {
  const { selectedCompany, handleCompanySelect } = useCompanyList(searchResult);

  if (loading) {
    return (
      <div className={cn(
        // 로딩 컨테이너
        'p-6 sm:p-12 flex flex-col items-center justify-center bg-white rounded-lg shadow-md'
      )}>
        <div className={cn(
          // 로딩 스피너
          'animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900 mb-4'
        )}></div>
        <p className={cn(
          // 로딩 텍스트
          'text-sm text-slate-600'
        )}>검색 결과를 불러오는 중...</p>
      </div>
    );
  }

  if (!searchResult) {
    return (
      <div className={cn(
        // 빈 상태 컨테이너
        'bg-white p-6 sm:p-8 rounded-lg shadow-md text-center'
      )}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={cn(
            // 아이콘 크기
            'h-10 w-10 sm:h-12 sm:w-12 mx-auto text-slate-400 mb-4'
          )} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
        <p className={cn(
          // 메인 메시지
          'text-slate-600 font-medium text-sm sm:text-base'
        )}>검색 결과가 여기에 표시됩니다.</p>
        <p className={cn(
          // 서브 메시지
          'text-slate-500 text-xs sm:text-sm mt-2'
        )}>위 검색 양식을 통해 검색을 시작하세요.</p>
      </div>
    );
  }

  if (searchResult.totalCount === 0) {
    return (
      <div className={cn(
        // 결과 없음 컨테이너
        'bg-white p-6 sm:p-8 rounded-lg shadow-md text-center'
      )}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={cn(
            // 아이콘 크기
            'h-10 w-10 sm:h-12 sm:w-12 mx-auto text-slate-400 mb-4'
          )} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 4v.01M18 14l-2-2M6 14l2-2M14 18l-2-2M10 18l2-2" 
          />
        </svg>
        <p className={cn(
          // 메인 메시지
          'text-slate-600 font-medium text-sm sm:text-base'
        )}>검색 결과가 없습니다.</p>
        <p className={cn(
          // 서브 메시지
          'text-slate-500 text-xs sm:text-sm mt-2'
        )}>다른 검색어나 필터를 시도해보세요.</p>
        <div className={cn('mt-4')}>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={cn('text-xs sm:text-sm')}
          >
            검색 양식으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      // 메인 컨테이너
      'bg-white rounded-lg shadow-md'
    )}>
      <div className={cn(
        // 헤더 영역
        'p-3 sm:p-4 border-b border-slate-200 flex flex-wrap justify-between items-center'
      )}>
        <p className={cn(
          // 결과 카운트 텍스트
          'text-xs sm:text-sm text-slate-600'
        )}>
          총 <span className={cn('font-semibold')}>{searchResult.totalCount.toLocaleString()}</span>건의 검색 결과 (
          {searchResult.currentPage}/{searchResult.totalPages} 페이지)
        </p>
        <div className={cn(
          // 페이지당 결과 수
          'flex items-center text-xs sm:text-sm text-slate-500 mt-1 sm:mt-0'
        )}>
          <span>페이지당 20개 결과</span>
        </div>
      </div>

      {/* 모바일 뷰 - 카드 레이아웃 */}
      <div className={cn('block sm:hidden')}>
        <div className={cn(
          // 카드 리스트 구분선
          'divide-y divide-slate-200'
        )}>
          {searchResult.companies.map((company, index) => (
            <CompanyCard
              key={company.code || index}
              company={company}
              isSelected={selectedCompany === company}
              onSelect={handleCompanySelect}
            />
          ))}
        </div>
      </div>

      {/* 데스크톱 뷰 - 테이블 레이아웃 */}
      <CompanyTable
        searchResult={searchResult}
        selectedCompany={selectedCompany as CompanyDetails | null}
        onSelect={handleCompanySelect}
      />

      {/* 페이지네이션 */}
      <Pagination 
        searchResult={searchResult} 
        onPageChange={onPageChange} 
      />
    </div>
  );
};

export default CompanyList;
