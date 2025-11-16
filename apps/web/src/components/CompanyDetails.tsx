import React from 'react';
import { CompanyDetails } from '../types/company';
import { getWantedSearchUrl } from '../utils/company';
import { cn } from 'ui';

interface CompanyDetailsProps {
  company: CompanyDetails;
  isMobile?: boolean;
}

/**
 * 업체 상세 정보 컴포넌트
 */
export const CompanyDetailsView: React.FC<CompanyDetailsProps> = ({ 
  company, 
  isMobile = false 
}) => {
  if (isMobile) {
    return (
      <div className={cn(
        // 모바일 상세 정보 컨테이너
        'mt-3 p-3 bg-slate-50 rounded-md text-xs'
      )}>
        <div className={cn(
          // 그리드 레이아웃 (2열)
          'grid grid-cols-2 gap-3'
        )}>
          <div className={cn(
            // 업체명 (전체 너비)
            'col-span-2'
          )}>
            <p className={cn(
              // 레이블 스타일
              'text-slate-500 mb-1'
            )}>업체명</p>
            <p className={cn(
              // 값 스타일
              'font-medium'
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
            </p>
          </div>
          <div>
            <p className={cn('text-slate-500 mb-1')}>업체 코드</p>
            <p className={cn('font-medium')}>{company.code || '-'}</p>
          </div>
          <div>
            <p className={cn('text-slate-500 mb-1')}>선정년도</p>
            <p className={cn('font-medium')}>{company.selectionYear || '-'}</p>
          </div>
          <div className={cn('col-span-2')}>
            <p className={cn('text-slate-500 mb-1')}>소재지</p>
            <p className={cn('font-medium')}>{company.address || '-'}</p>
          </div>
          <div>
            <p className={cn('text-slate-500 mb-1')}>현역 배정인원</p>
            <p className={cn('font-medium')}>{company.activeQuota || '-'}</p>
          </div>
          <div>
            <p className={cn('text-slate-500 mb-1')}>보충역 배정인원</p>
            <p className={cn('font-medium')}>{company.reserveQuota || '-'}</p>
          </div>
          <div className={cn('col-span-2')}>
            <p className={cn('text-slate-500 mb-1')}>업종</p>
            <p className={cn('font-medium')}>{company.industryType || '-'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      // 데스크톱 상세 정보 컨테이너
      'bg-slate-50 p-4'
    )}>
      <div className={cn(
        // 그리드 레이아웃 (반응형)
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm'
      )}>
        <div>
          <p className={cn('text-slate-500 mb-1')}>업체명</p>
          <p className={cn('font-medium')}>
            <a 
              href={getWantedSearchUrl(company.name)} 
              target="_blank" 
              rel="noopener noreferrer"
              className={cn('text-blue-600 hover:text-blue-800 hover:underline')}
            >
              {company.name}
            </a>
          </p>
        </div>
        <div>
          <p className={cn('text-slate-500 mb-1')}>업체 코드</p>
          <p className={cn('font-medium')}>{company.code || '-'}</p>
        </div>
        <div>
          <p className={cn('text-slate-500 mb-1')}>지방청</p>
          <p className={cn('font-medium')}>{company.regionalOffice || '-'}</p>
        </div>
        <div>
          <p className={cn('text-slate-500 mb-1')}>소재지</p>
          <p className={cn('font-medium')}>{company.address || '-'}</p>
        </div>
        <div>
          <p className={cn('text-slate-500 mb-1')}>선정년도</p>
          <p className={cn('font-medium')}>{company.selectionYear || '-'}</p>
        </div>
        <div>
          <p className={cn('text-slate-500 mb-1')}>업종</p>
          <p className={cn('font-medium')}>{company.industryType || '-'}</p>
        </div>
        <div>
          <p className={cn('text-slate-500 mb-1')}>현역 배정인원</p>
          <p className={cn('font-medium')}>{company.activeQuota || '-'}</p>
        </div>
        <div>
          <p className={cn('text-slate-500 mb-1')}>보충역 배정인원</p>
          <p className={cn('font-medium')}>{company.reserveQuota || '-'}</p>
        </div>
        <div>
          <p className={cn('text-slate-500 mb-1')}>채용 중</p>
          <p className={cn('font-medium')}>
            {company.isRecruiting ? (
              <span className={cn('text-green-600')}>모집 중</span>
            ) : (
              <span className={cn('text-slate-500')}>미모집</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

