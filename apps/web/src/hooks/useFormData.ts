import { useState } from 'react';
import { useServiceTypes } from './useServiceTypes';
import { useCompanySizes } from './useCompanySizes';
import { useIndustryTypes } from './useIndustryTypes';
import { useRegions } from './useRegions';
import { MMAClient } from 'mma-sdk';

interface FormDataState {
  serviceTypes: ReturnType<typeof useServiceTypes>['serviceTypes'];
  companySizes: ReturnType<typeof useCompanySizes>['companySizes'];
  industryTypes: ReturnType<typeof useIndustryTypes>['industryTypes'];
  provinces: ReturnType<typeof useRegions>['provinces'];
  cities: ReturnType<typeof useRegions>['cities'];
  isLoadingServiceTypes: ReturnType<typeof useServiceTypes>['isLoading'];
  isLoadingCompanySizes: ReturnType<typeof useCompanySizes>['isLoading'];
  isLoadingIndustries: ReturnType<typeof useIndustryTypes>['isLoading'];
  isLoadingProvinces: ReturnType<typeof useRegions>['isLoadingProvinces'];
  isLoadingCities: ReturnType<typeof useRegions>['isLoadingCities'];
  selectedServiceType: ReturnType<typeof useServiceTypes>['selectedServiceType'];
  selectedCompanySize: ReturnType<typeof useCompanySizes>['selectedCompanySize'];
  selectedIndustries: ReturnType<typeof useIndustryTypes>['selectedIndustries'];
  companyName: string;
  selectedProvince: ReturnType<typeof useRegions>['selectedProvince'];
  selectedCity: ReturnType<typeof useRegions>['selectedCity'];
  hasRecruitment: boolean;
  hasActiveQuota: boolean;
  hasReserveQuota: boolean;
}

interface FormDataActions {
  setSelectedServiceType: ReturnType<typeof useServiceTypes>['setSelectedServiceType'];
  setSelectedCompanySize: ReturnType<typeof useCompanySizes>['setSelectedCompanySize'];
  setSelectedIndustries: ReturnType<typeof useIndustryTypes>['setSelectedIndustries'];
  setCompanyName: (value: string) => void;
  setSelectedProvince: ReturnType<typeof useRegions>['setSelectedProvince'];
  setSelectedCity: ReturnType<typeof useRegions>['setSelectedCity'];
  setHasRecruitment: (value: boolean) => void;
  setHasActiveQuota: (value: boolean) => void;
  setHasReserveQuota: (value: boolean) => void;
  handleIndustryToggle: ReturnType<typeof useIndustryTypes>['handleIndustryToggle'];
  handleToggleAllIndustries: ReturnType<typeof useIndustryTypes>['handleToggleAllIndustries'];
  resetForm: () => void;
}

/**
 * 폼 데이터 관리 통합 훅
 */
export function useFormData(): [FormDataState, FormDataActions] {
  const proxyUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
  
  const serviceTypesHook = useServiceTypes(proxyUrl);
  const companySizesHook = useCompanySizes(proxyUrl);
  const regionsHook = useRegions(proxyUrl);
  const industryTypesHook = useIndustryTypes(
    serviceTypesHook.selectedServiceType,
    proxyUrl
  );

  // 폼 값 상태
  const [companyName, setCompanyName] = useState<string>('');
  const [hasRecruitment, setHasRecruitment] = useState<boolean>(false);
  const [hasActiveQuota, setHasActiveQuota] = useState<boolean>(false);
  const [hasReserveQuota, setHasReserveQuota] = useState<boolean>(false);

  /**
   * 폼 초기화
   */
  const resetForm = () => {
    setCompanyName('');
    regionsHook.setSelectedProvince('');
    regionsHook.setSelectedCity('');
    setHasRecruitment(false);
    setHasActiveQuota(false);
    setHasReserveQuota(false);
    
    // 업종 목록 리셋
    industryTypesHook.resetIndustries();
  };

  return [
    {
      serviceTypes: serviceTypesHook.serviceTypes,
      companySizes: companySizesHook.companySizes,
      industryTypes: industryTypesHook.industryTypes,
      provinces: regionsHook.provinces,
      cities: regionsHook.cities,
      isLoadingServiceTypes: serviceTypesHook.isLoading,
      isLoadingCompanySizes: companySizesHook.isLoading,
      isLoadingIndustries: industryTypesHook.isLoading,
      isLoadingProvinces: regionsHook.isLoadingProvinces,
      isLoadingCities: regionsHook.isLoadingCities,
      selectedServiceType: serviceTypesHook.selectedServiceType,
      selectedCompanySize: companySizesHook.selectedCompanySize,
      selectedIndustries: industryTypesHook.selectedIndustries,
      companyName,
      selectedProvince: regionsHook.selectedProvince,
      selectedCity: regionsHook.selectedCity,
      hasRecruitment,
      hasActiveQuota,
      hasReserveQuota
    },
    {
      setSelectedServiceType: serviceTypesHook.setSelectedServiceType,
      setSelectedCompanySize: companySizesHook.setSelectedCompanySize,
      setSelectedIndustries: industryTypesHook.setSelectedIndustries,
      setCompanyName,
      setSelectedProvince: regionsHook.setSelectedProvince,
      setSelectedCity: regionsHook.setSelectedCity,
      setHasRecruitment,
      setHasActiveQuota,
      setHasReserveQuota,
      handleIndustryToggle: industryTypesHook.handleIndustryToggle,
      handleToggleAllIndustries: industryTypesHook.handleToggleAllIndustries,
      resetForm
    }
  ];
}
