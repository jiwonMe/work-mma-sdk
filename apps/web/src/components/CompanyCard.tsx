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

/**
 * 모바일용 업체 카드 컴포넌트
 */
export const CompanyCard: React.FC<CompanyCardProps> = ({ 
  company, 
  isSelected, 
  onSelect 
}) => {
  return (
    <div className={cn(
      // 카드 컨테이너
      'p-3'
    )}>
      <div className={cn(
        // 카드 내부 레이아웃
        'flex justify-between items-start'
      )}>
        <div>
          <a 
            href={getWantedSearchUrl(company.name)} 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
              // 업체명 링크 스타일
              'font-medium text-sm text-blue-600 hover:text-blue-800 hover:underline'
            )}
          >
            {company.name}
          </a>
          <p className={cn(
            // 지방청 정보
            'text-xs text-slate-500 mt-1'
          )}>
            {company.regionalOffice || '-'}
          </p>
        </div>
        <div className={cn(
          // 오른쪽 액션 영역
          'flex flex-col items-end'
        )}>
          {company.isRecruiting && (
            <span className={cn(
              // 모집중 배지
              'inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
            )}>
              모집중
            </span>
          )}
          <button
            onClick={() => onSelect(company)}
            className={cn(
              // 상세 정보 토글 버튼
              'mt-1 inline-flex items-center justify-center p-1 rounded-md hover:bg-slate-200 transition-colors'
            )}
            aria-label="상세 정보 보기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={cn(
                // 아이콘 스타일
                'h-5 w-5',
                // 선택된 경우 회전
                isSelected ? 'text-blue-500 transform rotate-180' : 'text-slate-500'
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
        </div>
      </div>
      
      {isSelected && (
        <CompanyDetailsView company={company as CompanyDetails} isMobile={true} />
      )}
    </div>
  );
};

