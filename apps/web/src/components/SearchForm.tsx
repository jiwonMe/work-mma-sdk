import React, { useState, useEffect } from 'react';
import { CompanySearchParams } from 'mma-sdk';
import { isSearchParamsValid } from '../services';
import { useFormData } from '../hooks';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { QuickSearchForm } from './QuickSearchForm';
import { AdvancedSearchForm } from './AdvancedSearchForm';
import { cn } from 'ui';
import { trackTabSwitch, trackSearchHistoryUsed } from '../utils/analytics';

interface SearchFormProps {
  onSearch: (params: CompanySearchParams) => void;
  initialQuery?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, initialQuery }) => {
  const { searchHistory, addToHistory, removeFromHistory } = useSearchHistory();
  const [activeTab, setActiveTab] = useState<'quick' | 'advanced'>('quick');
  const [isOptionsExpanded, setIsOptionsExpanded] = useState(false);
  const [isIndustriesExpanded, setIsIndustriesExpanded] = useState(false);

  const [formState, formActions] = useFormData();
  const {
    serviceTypes, companySizes, industryTypes, provinces, cities,
    isLoadingServiceTypes, isLoadingCompanySizes, isLoadingIndustries,
    isLoadingProvinces, isLoadingCities,
    selectedServiceType, selectedCompanySize, selectedIndustries,
    companyName, selectedProvince, selectedCity,
    hasRecruitment, hasActiveQuota, hasReserveQuota
  } = formState;

  // URL 파라미터에서 초기 검색어 설정
  useEffect(() => {
    if (initialQuery && !companyName) {
      formActions.setCompanyName(initialQuery);
    }
  }, [initialQuery]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName?.trim()) addToHistory(companyName);
    onSearch(createSearchParams());
  };

  const handleHistorySelect = (term: string) => {
    // Track search history usage event
    trackSearchHistoryUsed(term);
    formActions.setCompanyName(term);
    onSearch(createSearchParams(term));
  };

  const handleTabChange = (tab: 'quick' | 'advanced') => {
    // Track tab switch event
    trackTabSwitch(tab);
    setActiveTab(tab);
  };

  const isFormValid = isSearchParamsValid({
    eopjong_gbcd: selectedServiceType,
    eopjong_cd: selectedIndustries
  });

  const isLoading = isLoadingServiceTypes || isLoadingCompanySizes || isLoadingProvinces;

  return (
    <div className={cn('relative')}>
      {isLoading && (
        <div className={cn('absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-xl')}>
          <div className={cn('flex items-center gap-2 text-sm text-gray-500')}>
            <div className={cn('w-5 h-5 border-2 border-gray-200 border-t-primary-500 rounded-full animate-spin')} />
            불러오는 중...
          </div>
        </div>
      )}

      <div className={cn('bg-white rounded-xl border border-gray-200/60 shadow-sm overflow-hidden')}>
        {/* Tabs */}
        <div className={cn('flex items-center gap-1 px-3 pt-3')}>
          <button
            type="button"
            onClick={() => handleTabChange('quick')}
            className={cn(
              'px-3 py-1.5 text-xs rounded-md transition-colors',
              activeTab === 'quick'
                ? 'bg-gray-100 text-gray-700 font-medium'
                : 'text-gray-400 hover:text-gray-600'
            )}
          >
            빠른 검색
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('advanced')}
            className={cn(
              'px-3 py-1.5 text-xs rounded-md transition-colors',
              activeTab === 'advanced'
                ? 'bg-gray-100 text-gray-700 font-medium'
                : 'text-gray-400 hover:text-gray-600'
            )}
          >
            상세 검색
          </button>
        </div>

        {/* Content */}
        <div className={cn('p-4')}>
          {activeTab === 'quick' ? (
            <QuickSearchForm
              companyName={companyName}
              searchHistory={searchHistory}
              onCompanyNameChange={formActions.setCompanyName}
              onSubmit={handleSubmit}
              onHistorySelect={handleHistorySelect}
              onHistoryRemove={removeFromHistory}
            />
          ) : (
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
              onServiceTypeChange={formActions.setSelectedServiceType}
              onCompanySizeChange={formActions.setSelectedCompanySize}
              onProvinceChange={formActions.setSelectedProvince}
              onCityChange={formActions.setSelectedCity}
              onRecruitmentChange={formActions.setHasRecruitment}
              onActiveQuotaChange={formActions.setHasActiveQuota}
              onReserveQuotaChange={formActions.setHasReserveQuota}
              onIndustryToggle={formActions.handleIndustryToggle}
              onToggleAllIndustries={formActions.handleToggleAllIndustries}
              onToggleIndustriesExpanded={() => setIsIndustriesExpanded(!isIndustriesExpanded)}
              onReset={formActions.resetForm}
              onSubmit={handleSubmit}
              isValid={isFormValid}
              isOptionsExpanded={isOptionsExpanded}
              onToggleOptionsExpanded={() => setIsOptionsExpanded(!isOptionsExpanded)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
