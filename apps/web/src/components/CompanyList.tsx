import React from 'react';
import { Button } from 'ui';
import { Company, SearchResult } from 'mma-sdk';

interface CompanyListProps {
  searchResult: SearchResult | null;
  loading: boolean;
  onPageChange: (page: number) => void;
}

const CompanyList: React.FC<CompanyListProps> = ({ searchResult, loading, onPageChange }) => {
  if (loading) {
    return (
      <div className="p-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!searchResult) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-slate-600">검색 결과가 여기에 표시됩니다.</p>
        <p className="text-slate-500 text-sm mt-2">위 검색 양식을 통해 검색을 시작하세요.</p>
      </div>
    );
  }

  if (searchResult.totalCount === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-slate-600">검색 결과가 없습니다.</p>
        <p className="text-slate-500 text-sm mt-2">다른 검색어나 필터를 시도해보세요.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-slate-200">
        <p className="text-sm text-slate-600">
          총 <span className="font-semibold">{searchResult.totalCount}</span>건의 검색 결과 (
          {searchResult.currentPage}/{searchResult.totalPages} 페이지)
        </p>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50">
            <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">업체명</th>
            <th className="py-3 px-4 text-center text-sm font-medium text-slate-700 hidden md:table-cell">
              선정년도
            </th>
            <th className="py-3 px-4 text-center text-sm font-medium text-slate-700 hidden sm:table-cell">
              지방청
            </th>
            <th className="py-3 px-4 text-center text-sm font-medium text-slate-700">채용유무</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {searchResult.companies.map((company: Company, index) => (
            <tr key={company.code || index} className="hover:bg-slate-50">
              <td className="py-3 px-4 text-sm font-medium">{company.name}</td>
              <td className="py-3 px-4 text-sm text-center text-slate-600 hidden md:table-cell">
                {company.selectionYear || '-'}
              </td>
              <td className="py-3 px-4 text-sm text-center text-slate-600 hidden sm:table-cell">
                {company.regionalOffice || '-'}
              </td>
              <td className="py-3 px-4 text-center">
                {company.isRecruiting ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    모집중
                  </span>
                ) : (
                  <span className="text-sm text-slate-500">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {searchResult.totalPages > 1 && (
        <div className="flex justify-center p-4 border-t border-slate-200">
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={searchResult.currentPage === 1}
            >
              처음
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(searchResult.currentPage - 1)}
              disabled={searchResult.currentPage === 1}
            >
              이전
            </Button>
            {[...Array(Math.min(5, searchResult.totalPages))].map((_, i) => {
              // Calculate page numbers to show (center current page if possible)
              let pageNum: number;
              if (searchResult.totalPages <= 5) {
                pageNum = i + 1;
              } else if (searchResult.currentPage <= 3) {
                pageNum = i + 1;
              } else if (searchResult.currentPage >= searchResult.totalPages - 2) {
                pageNum = searchResult.totalPages - 4 + i;
              } else {
                pageNum = searchResult.currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={searchResult.currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(searchResult.currentPage + 1)}
              disabled={searchResult.currentPage === searchResult.totalPages}
            >
              다음
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(searchResult.totalPages)}
              disabled={searchResult.currentPage === searchResult.totalPages}
            >
              마지막
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyList; 