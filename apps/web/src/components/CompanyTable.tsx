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

/**
 * 데스크톱용 업체 테이블 컴포넌트
 */
export const CompanyTable: React.FC<CompanyTableProps> = ({ 
  searchResult, 
  selectedCompany, 
  onSelect 
}) => {
  return (
    <div className={cn(
      // 테이블 컨테이너
      'hidden sm:block overflow-x-auto'
    )}>
      <table className={cn('w-full border-collapse')}>
        <thead>
          <tr className={cn(
            // 테이블 헤더 배경
            'bg-slate-50'
          )}>
            <th className={cn(
              // 헤더 셀 기본 스타일
              'py-3 px-4 text-left text-sm font-medium text-slate-700'
            )}>업체명</th>
            <th className={cn(
              // 선정년도 컬럼 (중간 크기 이상에서만 표시)
              'py-3 px-4 text-center text-sm font-medium text-slate-700 hidden md:table-cell'
            )}>
              선정년도
            </th>
            <th className={cn(
              // 지방청 컬럼
              'py-3 px-4 text-center text-sm font-medium text-slate-700'
            )}>
              지방청
            </th>
            <th className={cn(
              // 채용유무 컬럼
              'py-3 px-4 text-center text-sm font-medium text-slate-700'
            )}>채용유무</th>
            <th className={cn(
              // 상세 컬럼
              'py-3 px-4 text-center text-sm font-medium text-slate-700 w-24'
            )}>상세</th>
          </tr>
        </thead>
        <tbody className={cn(
          // 테이블 바디 구분선
          'divide-y divide-slate-200'
        )}>
          {searchResult.companies.map((company: Company, index) => (
            <React.Fragment key={company.code || index}>
              <tr className={cn(
                // 행 기본 스타일
                'hover:bg-slate-50',
                // 선택된 행 강조
                selectedCompany === company ? 'bg-slate-50' : ''
              )}>
                <td className={cn(
                  // 업체명 셀
                  'py-3 px-4 text-sm font-medium'
                )}>
                  <a 
                    href={getWantedSearchUrl(company.name)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={cn(
                      // 링크 스타일
                      'text-blue-600 hover:text-blue-800 hover:underline'
                    )}
                  >
                    {company.name}
                  </a>
                </td>
                <td className={cn(
                  // 선정년도 셀
                  'py-3 px-4 text-sm text-center text-slate-600 hidden md:table-cell'
                )}>
                  {company.selectionYear || '-'}
                </td>
                <td className={cn(
                  // 지방청 셀
                  'py-3 px-4 text-sm text-center text-slate-600'
                )}>
                  {company.regionalOffice || '-'}
                </td>
                <td className={cn('py-3 px-4 text-center')}>
                  {company.isRecruiting ? (
                    <span className={cn(
                      // 모집중 배지
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
                    )}>
                      모집중
                    </span>
                  ) : (
                    <span className={cn(
                      // 미모집 텍스트
                      'text-sm text-slate-500'
                    )}>-</span>
                  )}
                </td>
                <td className={cn('py-3 px-4 text-center')}>
                  <button
                    onClick={() => onSelect(company)}
                    className={cn(
                      // 상세 정보 토글 버튼
                      'inline-flex items-center justify-center p-1 rounded-md hover:bg-slate-200 transition-colors'
                    )}
                    title="상세 정보 보기"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={cn(
                        // 아이콘 스타일
                        'h-5 w-5',
                        // 선택된 경우 회전
                        selectedCompany === company ? 'text-blue-500 transform rotate-180' : 'text-slate-500'
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 9l-7 7-7-7" 
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              {selectedCompany === company && (
                <tr>
                  <td colSpan={5} className={cn('bg-slate-50 p-4')}>
                    <CompanyDetailsView company={selectedCompany} isMobile={false} />
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

