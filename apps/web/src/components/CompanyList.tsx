import React from 'react';
import { Button } from 'ui';
import { Company, SearchResult } from 'mma-sdk';
import { useCompanyList } from '../hooks';

interface CompanyListProps {
  searchResult: SearchResult | null;
  loading: boolean;
  onPageChange: (page: number) => void;
}

// Extended Company type to include possible properties that might be returned
interface CompanyDetails extends Company {
  address?: string;
  industryType?: string;
  activeQuota?: string | number;
  reserveQuota?: string | number;
}

// Utility function to clean company name and generate Wanted search URL
const getWantedSearchUrl = (companyName: string): string => {
  // Remove terms like "(주)", "주식회사" etc.
  const cleanedName = companyName
    .replace(/(\(주\)|주식회사|㈜|（주）)/g, '')
    .trim();
  
  // Generate Wanted search URL
  return `https://www.wanted.co.kr/search?query=${encodeURIComponent(cleanedName)}`;
};

const CompanyList: React.FC<CompanyListProps> = ({ searchResult, loading, onPageChange }) => {
  const { selectedCompany, pageNumbers, handleCompanySelect } = useCompanyList(searchResult);

  if (loading) {
    return (
      <div className="p-6 sm:p-12 flex flex-col items-center justify-center bg-white rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900 mb-4"></div>
        <p className="text-sm text-slate-600">검색 결과를 불러오는 중...</p>
      </div>
    );
  }

  if (!searchResult) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p className="text-slate-600 font-medium text-sm sm:text-base">검색 결과가 여기에 표시됩니다.</p>
        <p className="text-slate-500 text-xs sm:text-sm mt-2">위 검색 양식을 통해 검색을 시작하세요.</p>
      </div>
    );
  }

  if (searchResult.totalCount === 0) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 4v.01M18 14l-2-2M6 14l2-2M14 18l-2-2M10 18l2-2" />
        </svg>
        <p className="text-slate-600 font-medium text-sm sm:text-base">검색 결과가 없습니다.</p>
        <p className="text-slate-500 text-xs sm:text-sm mt-2">다른 검색어나 필터를 시도해보세요.</p>
        <div className="mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xs sm:text-sm"
          >
            검색 양식으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-3 sm:p-4 border-b border-slate-200 flex flex-wrap justify-between items-center">
        <p className="text-xs sm:text-sm text-slate-600">
          총 <span className="font-semibold">{searchResult.totalCount.toLocaleString()}</span>건의 검색 결과 (
          {searchResult.currentPage}/{searchResult.totalPages} 페이지)
        </p>
        <div className="flex items-center text-xs sm:text-sm text-slate-500 mt-1 sm:mt-0">
          <span>페이지당 20개 결과</span>
        </div>
      </div>

      {/* Mobile view - Card-based layout */}
      <div className="block sm:hidden">
        <div className="divide-y divide-slate-200">
          {searchResult.companies.map((company: Company, index) => (
            <div key={company.code || index} className="p-3">
              <div className="flex justify-between items-start">
                <div>
                  <a 
                    href={getWantedSearchUrl(company.name)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {company.name}
                  </a>
                  <p className="text-xs text-slate-500 mt-1">
                    {company.regionalOffice || '-'}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  {company.isRecruiting ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      모집중
                    </span>
                  ) : null}
                  <button
                    onClick={() => handleCompanySelect(company)}
                    className="mt-1 inline-flex items-center justify-center p-1 rounded-md hover:bg-slate-200 transition-colors"
                    aria-label="상세 정보 보기"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${selectedCompany === company ? 'text-blue-500 transform rotate-180' : 'text-slate-500'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {selectedCompany === company && (
                <div className="mt-3 p-3 bg-slate-50 rounded-md text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <p className="text-slate-500 mb-1">업체명</p>
                      <p className="font-medium">
                        <a 
                          href={getWantedSearchUrl(selectedCompany.name)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {selectedCompany.name}
                        </a>
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">업체 코드</p>
                      <p className="font-medium">{selectedCompany.code || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">선정년도</p>
                      <p className="font-medium">{selectedCompany.selectionYear || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-500 mb-1">소재지</p>
                      <p className="font-medium">{selectedCompany.address || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">현역 배정인원</p>
                      <p className="font-medium">{selectedCompany.activeQuota || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">보충역 배정인원</p>
                      <p className="font-medium">{selectedCompany.reserveQuota || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-500 mb-1">업종</p>
                      <p className="font-medium">{selectedCompany.industryType || '-'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop view - Table layout */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">업체명</th>
              <th className="py-3 px-4 text-center text-sm font-medium text-slate-700 hidden md:table-cell">
                선정년도
              </th>
              <th className="py-3 px-4 text-center text-sm font-medium text-slate-700">
                지방청
              </th>
              <th className="py-3 px-4 text-center text-sm font-medium text-slate-700">채용유무</th>
              <th className="py-3 px-4 text-center text-sm font-medium text-slate-700 w-24">상세</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {searchResult.companies.map((company: Company, index) => (
              <React.Fragment key={company.code || index}>
                <tr className={`hover:bg-slate-50 ${selectedCompany === company ? 'bg-slate-50' : ''}`}>
                  <td className="py-3 px-4 text-sm font-medium">
                    <a 
                      href={getWantedSearchUrl(company.name)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {company.name}
                    </a>
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-slate-600 hidden md:table-cell">
                    {company.selectionYear || '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-slate-600">
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
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleCompanySelect(company)}
                      className="inline-flex items-center justify-center p-1 rounded-md hover:bg-slate-200 transition-colors"
                      title="상세 정보 보기"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${selectedCompany === company ? 'text-blue-500 transform rotate-180' : 'text-slate-500'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </td>
                </tr>
                {selectedCompany === company && (
                  <tr>
                    <td colSpan={5} className="bg-slate-50 p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500 mb-1">업체명</p>
                          <p className="font-medium">
                            <a 
                              href={getWantedSearchUrl(selectedCompany.name)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {selectedCompany.name}
                            </a>
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">업체 코드</p>
                          <p className="font-medium">{selectedCompany.code || '-'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">지방청</p>
                          <p className="font-medium">{selectedCompany.regionalOffice || '-'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">소재지</p>
                          <p className="font-medium">{selectedCompany.address || '-'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">선정년도</p>
                          <p className="font-medium">{selectedCompany.selectionYear || '-'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">업종</p>
                          <p className="font-medium">{selectedCompany.industryType || '-'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">현역 배정인원</p>
                          <p className="font-medium">{selectedCompany.activeQuota || '-'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">보충역 배정인원</p>
                          <p className="font-medium">{selectedCompany.reserveQuota || '-'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">채용 중</p>
                          <p className="font-medium">
                            {selectedCompany.isRecruiting ? (
                              <span className="text-green-600">모집 중</span>
                            ) : (
                              <span className="text-slate-500">미모집</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {searchResult.totalPages > 1 && (
        <div className="flex justify-center p-3 sm:p-4 border-t border-slate-200 overflow-x-auto">
          <nav className="flex items-center space-x-1" aria-label="Pagination">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={searchResult.currentPage === 1}
              className="hidden sm:inline-flex text-xs"
            >
              처음
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(searchResult.currentPage - 1)}
              disabled={searchResult.currentPage === 1}
              className="text-xs px-2 sm:px-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="ml-1 hidden sm:inline">이전</span>
            </Button>
            
            <div className="flex space-x-1 overflow-x-auto max-w-xs sm:max-w-none px-1 sm:px-0">
              {pageNumbers.map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={searchResult.currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className={`text-xs px-2 sm:px-3 ${searchResult.currentPage === pageNum ? 'pointer-events-none' : ''}`}
                >
                  {pageNum}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(searchResult.currentPage + 1)}
              disabled={searchResult.currentPage === searchResult.totalPages}
              className="text-xs px-2 sm:px-3"
            >
              <span className="mr-1 hidden sm:inline">다음</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(searchResult.totalPages)}
              disabled={searchResult.currentPage === searchResult.totalPages}
              className="hidden sm:inline-flex text-xs"
            >
              마지막
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default CompanyList; 