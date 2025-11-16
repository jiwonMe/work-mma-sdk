import React from 'react';
import { Button } from 'ui';
import { ServiceType, CompanySize, RegionType, CityType, IndustryType } from 'mma-sdk';
import { IndustrySelector } from './IndustrySelector';
import { SearchFormFields } from './SearchFormFields';
import { SearchFormOptions } from './SearchFormOptions';
import { cn } from 'ui';

interface AdvancedSearchFormProps {
  // 데이터
  serviceTypes: ServiceType[];
  companySizes: CompanySize[];
  provinces: RegionType[];
  cities: CityType[];
  
  // 로딩 상태
  isLoadingServiceTypes: boolean;
  isLoadingCompanySizes: boolean;
  isLoadingProvinces: boolean;
  isLoadingCities: boolean;
  
  // 선택된 값
  selectedServiceType: string;
  selectedCompanySize: string;
  selectedProvince: string;
  selectedCity: string;
  hasRecruitment: boolean;
  hasActiveQuota: boolean;
  hasReserveQuota: boolean;
  
  // 업종 관련
  industries: IndustryType[];
  selectedIndustries: string[];
  isLoadingIndustries: boolean;
  isIndustriesExpanded: boolean;
  
  // 핸들러
  onServiceTypeChange: (value: string) => void;
  onCompanySizeChange: (value: string) => void;
  onProvinceChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onRecruitmentChange: (checked: boolean) => void;
  onActiveQuotaChange: (checked: boolean) => void;
  onReserveQuotaChange: (checked: boolean) => void;
  onIndustryToggle: (code: string) => void;
  onToggleAllIndustries: () => void;
  onToggleIndustriesExpanded: () => void;
  onReset: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isValid: boolean;
  
  // UI 상태
  isOptionsExpanded: boolean;
  onToggleOptionsExpanded: () => void;
}

/**
 * 상세 검색 폼 컴포넌트
 */
export const AdvancedSearchForm: React.FC<AdvancedSearchFormProps> = ({
  serviceTypes,
  companySizes,
  provinces,
  cities,
  isLoadingServiceTypes,
  isLoadingCompanySizes,
  isLoadingProvinces,
  isLoadingCities,
  selectedServiceType,
  selectedCompanySize,
  selectedProvince,
  selectedCity,
  hasRecruitment,
  hasActiveQuota,
  hasReserveQuota,
  industries,
  selectedIndustries,
  isLoadingIndustries,
  isIndustriesExpanded,
  onServiceTypeChange,
  onCompanySizeChange,
  onProvinceChange,
  onCityChange,
  onRecruitmentChange,
  onActiveQuotaChange,
  onReserveQuotaChange,
  onIndustryToggle,
  onToggleAllIndustries,
  onToggleIndustriesExpanded,
  onReset,
  onSubmit,
  isValid,
  isOptionsExpanded,
  onToggleOptionsExpanded,
}) => {
  return (
    <form onSubmit={onSubmit} className={cn(
      // 폼 컨테이너
      'space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 rounded-lg shadow-md'
    )}>
      {/* 기본 검색 필드 */}
      <SearchFormFields
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
        onServiceTypeChange={onServiceTypeChange}
        onCompanySizeChange={onCompanySizeChange}
        onProvinceChange={onProvinceChange}
        onCityChange={onCityChange}
      />

      {/* 추가 옵션 */}
      <SearchFormOptions
        hasRecruitment={hasRecruitment}
        hasActiveQuota={hasActiveQuota}
        hasReserveQuota={hasReserveQuota}
        onRecruitmentChange={onRecruitmentChange}
        onActiveQuotaChange={onActiveQuotaChange}
        onReserveQuotaChange={onReserveQuotaChange}
        isExpanded={isOptionsExpanded}
        onToggleExpanded={onToggleOptionsExpanded}
      />

      {/* 업종 선택 */}
      {selectedServiceType && (
        <IndustrySelector
          industries={industries}
          selectedIndustries={selectedIndustries}
          isLoading={isLoadingIndustries}
          onToggle={onIndustryToggle}
          onToggleAll={onToggleAllIndustries}
          isExpanded={isIndustriesExpanded}
          onToggleExpanded={onToggleIndustriesExpanded}
        />
      )}

      {/* 액션 버튼 */}
      <div className={cn('flex justify-end space-x-2 sm:space-x-4')}>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onReset} 
          size="sm" 
          className={cn('text-xs sm:text-sm')}
        >
          초기화
        </Button>
        <Button 
          type="submit" 
          disabled={!isValid || isLoadingServiceTypes || isLoadingIndustries}
          className={cn(
            'text-xs sm:text-sm',
            !isValid ? "opacity-50 cursor-not-allowed" : ""
          )}
          size="sm"
        >
          상세 검색
        </Button>
      </div>
    </form>
  );
};
