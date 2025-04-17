import React, { useState } from 'react';
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Checkbox } from 'ui';
import { CompanySearchParams } from 'mma-sdk';
import { isSearchParamsValid } from '../services';
import { useFormData } from '../hooks';

interface SearchFormProps {
  onSearch: (params: CompanySearchParams) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [
    {
      // Data
      serviceTypes,
      companySizes,
      industryTypes,
      provinces,
      cities,
      
      // Loading states
      isLoadingServiceTypes,
      isLoadingCompanySizes,
      isLoadingIndustries,
      isLoadingProvinces,
      isLoadingCities,
      
      // Selected values
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
  
  // UI state
  const [isOptionsExpanded, setIsOptionsExpanded] = useState<boolean>(false);
  const [isIndustriesExpanded, setIsIndustriesExpanded] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare search parameters
    const bjinwonym: string[] = [];
    if (hasActiveQuota) bjinwonym.push('H');
    if (hasReserveQuota) bjinwonym.push('B');

    const searchParams: CompanySearchParams = {
      eopjong_gbcd: selectedServiceType,
      gegyumo_cd: selectedCompanySize,
      eopjong_cd: selectedIndustries,
      eopche_nm: companyName,
      sido_addr: selectedProvince,
      sigungu_addr: selectedCity,
      chaeyongym: hasRecruitment ? 'Y' : '',
      bjinwonym,
      pageIndex: 1
    };

    onSearch(searchParams);
  };

  // Check if the form is valid and can be submitted
  const isFormValid = isSearchParamsValid({
    eopjong_gbcd: selectedServiceType,
    eopjong_cd: selectedIndustries
  });

  return (
    <div className="relative">
      {/* Loading overlay */}
      {(isLoadingServiceTypes || isLoadingCompanySizes || isLoadingProvinces) && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900 mb-2"></div>
            <p className="text-sm text-slate-700">데이터를 불러오는 중...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {/* Company Name Search - Emphasized */}
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <label htmlFor="companyName" className="block text-lg font-medium text-blue-800 mb-2">
            업체명으로 검색
            <span className="ml-2 text-sm font-normal text-blue-600">
              (회사 이름을 입력하여 빠르게 검색하세요)
            </span>
          </label>
          <div className="flex">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full pl-10 py-3 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="업체명 입력 (예: 삼성전자, LG전자 등)"
              />
            </div>
            <Button 
              type="submit" 
              className="ml-2 bg-blue-600 hover:bg-blue-700"
            >
              검색
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service Type */}
          <div className="space-y-2">
            <label htmlFor="serviceType" className="block text-sm font-medium">
              복무형태
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Select 
              value={selectedServiceType} 
              onValueChange={setSelectedServiceType} 
              disabled={isLoadingServiceTypes}
            >
              <SelectTrigger id="serviceType" className={isLoadingServiceTypes ? "animate-pulse" : ""}>
                <SelectValue placeholder="복무형태 선택" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type.code} value={type.code}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedServiceType && (
              <p className="text-xs text-slate-500 mt-1">
                선택한 복무형태: {serviceTypes.find(t => t.code === selectedServiceType)?.name}
              </p>
            )}
          </div>

          {/* Company Size */}
          <div className="space-y-2">
            <label htmlFor="companySize" className="block text-sm font-medium">
              기업별
            </label>
            <Select 
              value={selectedCompanySize} 
              onValueChange={setSelectedCompanySize}
              disabled={isLoadingCompanySizes}
            >
              <SelectTrigger id="companySize" className={isLoadingCompanySizes ? "animate-pulse" : ""}>
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">전체</SelectItem>
                {companySizes.map((size) => (
                  <SelectItem key={size.code} value={size.code}>
                    {size.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Province */}
          <div className="space-y-2">
            <label htmlFor="province" className="block text-sm font-medium">
              소재지 (시도)
            </label>
            <Select 
              value={selectedProvince} 
              onValueChange={setSelectedProvince}
              disabled={isLoadingProvinces}
            >
              <SelectTrigger id="province" className={isLoadingProvinces ? "animate-pulse" : ""}>
                <SelectValue placeholder="시도 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">전체</SelectItem>
                {provinces.map((province) => (
                  <SelectItem key={province.code} value={province.code}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City */}
          <div className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium">
              소재지 (시군구)
            </label>
            <Select 
              value={selectedCity} 
              onValueChange={setSelectedCity} 
              disabled={!selectedProvince || isLoadingCities}
            >
              <SelectTrigger id="city" className={isLoadingCities ? "animate-pulse" : ""}>
                <SelectValue placeholder={selectedProvince ? "시군구 선택" : "시도를 먼저 선택하세요"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">전체</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.code} value={city.code}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Options - Collapsible */}
        <div className="border border-slate-200 rounded-md overflow-hidden">
          <button
            type="button"
            className="w-full px-4 py-3 flex justify-between items-center bg-slate-50 hover:bg-slate-100 text-left transition-colors"
            onClick={() => setIsOptionsExpanded(!isOptionsExpanded)}
          >
            <div className="flex items-center">
              <span className="text-sm font-medium">추가 옵션</span>
              {(hasRecruitment || hasActiveQuota || hasReserveQuota) && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {[
                    hasRecruitment && '채용중',
                    hasActiveQuota && '현역',
                    hasReserveQuota && '보충역'
                  ].filter(Boolean).join(', ')}
                </span>
              )}
            </div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform duration-200 ${isOptionsExpanded ? 'transform rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isOptionsExpanded && (
            <div className="p-4 border-t border-slate-200">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-md">
                  <Checkbox
                    id="hasRecruitment"
                    checked={hasRecruitment}
                    onCheckedChange={(checked) => setHasRecruitment(checked === true)}
                  />
                  <label htmlFor="hasRecruitment" className="text-sm">
                    채용공고 등록업체
                  </label>
                </div>
                <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-md">
                  <Checkbox
                    id="hasActiveQuota"
                    checked={hasActiveQuota}
                    onCheckedChange={(checked) => setHasActiveQuota(checked === true)}
                  />
                  <label htmlFor="hasActiveQuota" className="text-sm">
                    현역 배정인원
                  </label>
                </div>
                <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-md">
                  <Checkbox
                    id="hasReserveQuota"
                    checked={hasReserveQuota}
                    onCheckedChange={(checked) => setHasReserveQuota(checked === true)}
                  />
                  <label htmlFor="hasReserveQuota" className="text-sm">
                    보충역 배정인원
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Industry Types - Collapsible */}
        {selectedServiceType && (
          <div className="border border-slate-200 rounded-md overflow-hidden">
            <button
              type="button"
              className="w-full px-4 py-3 flex justify-between items-center bg-slate-50 hover:bg-slate-100 text-left transition-colors"
              onClick={() => setIsIndustriesExpanded(!isIndustriesExpanded)}
            >
              <div className="flex items-center">
                <span className="text-sm font-medium">업종선택</span>
                <span className="ml-2 text-xs text-green-600 font-normal">(기본값: 전체 선택됨)</span>
                {selectedIndustries.length > 0 && selectedIndustries.length < industryTypes.length && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {selectedIndustries.length}/{industryTypes.length} 선택됨
                  </span>
                )}
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform duration-200 ${isIndustriesExpanded ? 'transform rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isIndustriesExpanded && (
              <div className="p-4 border-t border-slate-200">
                <div className="flex justify-end mb-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleToggleAllIndustries}
                    className={`text-xs ${selectedIndustries.length === industryTypes.length ? 'bg-slate-100' : ''}`}
                  >
                    {selectedIndustries.length === industryTypes.length ? "전체 해제" : "전체 선택"}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-4 border border-slate-200 rounded-md max-h-60 overflow-y-auto">
                  {industryTypes.length > 0 ? (
                    <>
                      {selectedIndustries.length === industryTypes.length && (
                        <div className="col-span-full bg-green-50 rounded-md p-2 mb-2 text-sm text-green-700 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          모든 업종이 선택되었습니다. 특정 업종만 검색하려면 원하지 않는 항목을 해제하세요.
                        </div>
                      )}
                      {industryTypes.map((industry) => (
                        <div key={industry.code} className="flex items-center space-x-2 p-2 rounded hover:bg-slate-50">
                          <Checkbox
                            id={`industry-${industry.code}`}
                            checked={selectedIndustries.includes(industry.code)}
                            onCheckedChange={() => handleIndustryToggle(industry.code)}
                          />
                          <label htmlFor={`industry-${industry.code}`} className="text-sm cursor-pointer">
                            {industry.name}
                          </label>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-slate-500 text-sm">복무형태를 선택하면 업종이 표시됩니다.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={resetForm}>
            초기화
          </Button>
          <Button 
            type="submit" 
            disabled={!isFormValid || isLoadingServiceTypes || isLoadingIndustries}
            className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
          >
            검색
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm; 