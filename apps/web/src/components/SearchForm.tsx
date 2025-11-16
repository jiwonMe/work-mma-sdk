import React, { useState } from 'react';
import { CompanySearchParams } from 'mma-sdk';
import { isSearchParamsValid } from '../services';
import { useFormData } from '../hooks';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { QuickSearchForm } from './QuickSearchForm';
import { AdvancedSearchForm } from './AdvancedSearchForm';
import { cn } from 'ui';

interface SearchFormProps {
  onSearch: (params: CompanySearchParams) => void;
}

/**
 * 검색 폼 메인 컴포넌트
 */
const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const { searchHistory, addToHistory, removeFromHistory } = useSearchHistory();
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState<boolean>(false);
  const [isOptionsExpanded, setIsOptionsExpanded] = useState<boolean>(false);
  const [isIndustriesExpanded, setIsIndustriesExpanded] = useState<boolean>(false);

  const [
    {
      serviceTypes,
      companySizes,
      industryTypes,
      provinces,
      cities,
      isLoadingServiceTypes,
      isLoadingCompanySizes,
      isLoadingIndustries,
      isLoadingProvinces,
      isLoadingCities,
      selectedServiceType,
      selectedCompanySize,
      selectedIndustries,
      companyName,
      selectedProvince,
      selectedCity,
      hasRecruitment,
      hasActiveQuota,
      hasReserveQuota
    },
    {
      setSelectedServiceType,
      setSelectedCompanySize,
      setCompanyName,
      setSelectedProvince,
      setSelectedCity,
      setHasRecruitment,
      setHasActiveQuota,
      setHasReserveQuota,
      handleIndustryToggle,
      handleToggleAllIndustries,
      resetForm
    }
  ] = useFormData();

  /**
   * 검색 파라미터 생성
   */
  const createSearchParams = (name?: string): CompanySearchParams => {
    const bjinwonym: string[] = [];
    if (hasActiveQuota) bjinwonym.push('H');
    if (hasReserveQuota) bjinwonym.push('B');

    return {
      eopjong_gbcd: selectedServiceType,
      gegyumo_cd: selectedCompanySize,
      eopjong_cd: selectedIndustries,
      eopche_nm: name || companyName,
      sido_addr: selectedProvince,
      sigungu_addr: selectedCity,
      chaeyongym: hasRecruitment ? 'Y' : '',
      bjinwonym,
      pageIndex: 1
    };
  };

  /**
   * 검색 실행 핸들러
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = createSearchParams();
    
    if (companyName && companyName.trim() !== '') {
      addToHistory(companyName);
    }
    
    onSearch(params);
  };

  /**
   * 히스토리에서 검색 실행
   */
  const handleHistorySelect = (term: string) => {
    setCompanyName(term);
    const params = createSearchParams(term);
    onSearch(params);
  };

  /**
   * 빠른 검색 폼 제출 핸들러
   */
  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    handleSubmit(e);
  };

  /**
   * 상세 검색 폼 제출 핸들러
   */
  const handleAdvancedSearchSubmit = (e: React.FormEvent) => {
    handleSubmit(e);
  };

  const isFormValid = isSearchParamsValid({
    eopjong_gbcd: selectedServiceType,
    eopjong_cd: selectedIndustries
  });

  return (
    <div className={cn(
      // 메인 컨테이너
      'relative space-y-5 sm:space-y-6'
    )}>
      {/* 로딩 오버레이 */}
      {(isLoadingServiceTypes || isLoadingCompanySizes || isLoadingProvinces) && (
        <div className={cn(
          // 로딩 오버레이 스타일
          'absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg'
        )}>
          <div className={cn('flex flex-col items-center')}>
            <div className={cn(
              // 로딩 스피너
              'animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-slate-900 mb-2'
            )}></div>
            <p className={cn(
              // 로딩 텍스트
              'text-xs sm:text-sm text-slate-700'
            )}>데이터를 불러오는 중...</p>
          </div>
        </div>
      )}

      {/* 빠른 검색 폼 */}
      <QuickSearchForm
        companyName={companyName}
        searchHistory={searchHistory}
        onCompanyNameChange={setCompanyName}
        onSubmit={handleQuickSearchSubmit}
        onHistorySelect={handleHistorySelect}
        onHistoryRemove={removeFromHistory}
      />

      {/* 상세 검색 토글 버튼 */}
      <div className={cn('flex justify-center')}>
        <button
          type="button"
          onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
          className={cn(
            // 토글 버튼 스타일
            'inline-flex items-center px-4 py-2 border border-slate-300 rounded-full text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none transition-colors'
          )}
        >
          {isAdvancedSearchOpen ? (
            <>
              <span>기본 검색만 보기</span>
              <svg 
                className={cn('ml-2 -mr-0.5 h-4 w-4')} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 15l7-7 7 7" 
                />
              </svg>
            </>
          ) : (
            <>
              <span>상세 검색 열기</span>
              <svg 
                className={cn('ml-2 -mr-0.5 h-4 w-4')} 
                xmlns="http://www.w3.org/2000/svg" 
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
            </>
          )}
        </button>
      </div>

      {/* 상세 검색 폼 */}
      {isAdvancedSearchOpen && (
        <AdvancedSearchForm
          serviceTypes={serviceTypes}
          companySizes={companySizes}
          provinces={provinces}
          cities={cities}
          isLoadingServiceTypes={isLoadingServiceTypes}
          isLoadingCompanySizes={isLoadingCompanySizes}
          isLoadingProvinces={isLoadingProvinces}
          isLoadingCities={isLoadingCities}
          selectedServiceType={selectedServiceType}
          selectedCompanySize={selectedCompanySize}
          selectedProvince={selectedProvince}
          selectedCity={selectedCity}
          hasRecruitment={hasRecruitment}
          hasActiveQuota={hasActiveQuota}
          hasReserveQuota={hasReserveQuota}
          industries={industryTypes}
          selectedIndustries={selectedIndustries}
          isLoadingIndustries={isLoadingIndustries}
          isIndustriesExpanded={isIndustriesExpanded}
          onServiceTypeChange={setSelectedServiceType}
          onCompanySizeChange={setSelectedCompanySize}
          onProvinceChange={setSelectedProvince}
          onCityChange={setSelectedCity}
          onRecruitmentChange={setHasRecruitment}
          onActiveQuotaChange={setHasActiveQuota}
          onReserveQuotaChange={setHasReserveQuota}
          onIndustryToggle={handleIndustryToggle}
          onToggleAllIndustries={handleToggleAllIndustries}
          onToggleIndustriesExpanded={() => setIsIndustriesExpanded(!isIndustriesExpanded)}
          onReset={resetForm}
          onSubmit={handleAdvancedSearchSubmit}
          isValid={isFormValid}
          isOptionsExpanded={isOptionsExpanded}
          onToggleOptionsExpanded={() => setIsOptionsExpanded(!isOptionsExpanded)}
        />
      )}
    </div>
  );
};

export default SearchForm;
