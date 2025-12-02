import React from 'react';
import { Button } from 'ui';
import { ServiceType, CompanySize, RegionType, CityType, IndustryType } from 'mma-sdk';
import { IndustrySelector } from './IndustrySelector';
import { SearchFormFields } from './SearchFormFields';
import { SearchFormOptions } from './SearchFormOptions';
import { cn } from 'ui';

interface AdvancedSearchFormProps {
  serviceTypes: ServiceType[];
  companySizes: CompanySize[];
  provinces: RegionType[];
  cities: CityType[];
  isLoadingServiceTypes: boolean;
  isLoadingCompanySizes: boolean;
  isLoadingProvinces: boolean;
  isLoadingCities: boolean;
  selectedServiceType: string;
  selectedCompanySize: string;
  selectedProvince: string;
  selectedCity: string;
  hasRecruitment: boolean;
  hasActiveQuota: boolean;
  hasReserveQuota: boolean;
  industries: IndustryType[];
  selectedIndustries: string[];
  isLoadingIndustries: boolean;
  isIndustriesExpanded: boolean;
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
  isOptionsExpanded: boolean;
  onToggleOptionsExpanded: () => void;
}

export const AdvancedSearchForm: React.FC<AdvancedSearchFormProps> = ({
  serviceTypes, companySizes, provinces, cities,
  isLoadingServiceTypes, isLoadingCompanySizes, isLoadingProvinces, isLoadingCities,
  selectedServiceType, selectedCompanySize, selectedProvince, selectedCity,
  hasRecruitment, hasActiveQuota, hasReserveQuota,
  industries, selectedIndustries, isLoadingIndustries, isIndustriesExpanded,
  onServiceTypeChange, onCompanySizeChange, onProvinceChange, onCityChange,
  onRecruitmentChange, onActiveQuotaChange, onReserveQuotaChange,
  onIndustryToggle, onToggleAllIndustries, onToggleIndustriesExpanded,
  onReset, onSubmit, isValid, isOptionsExpanded, onToggleOptionsExpanded,
}) => {
  return (
    <form onSubmit={onSubmit} className={cn('space-y-4')}>
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

      <div className={cn('flex justify-end gap-2 pt-2')}>
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          초기화
        </Button>
        <Button type="submit" size="sm" disabled={!isValid || isLoadingServiceTypes || isLoadingIndustries}>
          검색
        </Button>
      </div>
    </form>
  );
};
