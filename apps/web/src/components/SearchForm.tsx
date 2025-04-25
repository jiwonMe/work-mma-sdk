import React, { useState, useEffect } from 'react';
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Checkbox } from 'ui';
import { CompanySearchParams } from 'mma-sdk';
import { isSearchParamsValid } from '../services';
import { useFormData } from '../hooks';

interface SearchFormProps {
  onSearch: (params: CompanySearchParams) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  // Search history state
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

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
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState<boolean>(false);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('companySearchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse search history:', error);
      }
    }
  }, []);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('companySearchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

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

    // Add company name to search history if it exists and is not already in history
    if (companyName && companyName.trim() !== '') {
      const trimmedName = companyName.trim();
      setSearchHistory(prevHistory => {
        // Remove the term if it already exists (to avoid duplicates)
        const filteredHistory = prevHistory.filter(term => term !== trimmedName);
        // Add the new term at the beginning (most recent first)
        return [trimmedName, ...filteredHistory].slice(0, 10); // Keep only the 10 most recent searches
      });
    }

    onSearch(searchParams);
  };

  // Function to handle chip click (sets the search term)
  const handleChipClick = (term: string) => {
    setCompanyName(term);
  };

  // Function to remove a search term from history
  const removeSearchTerm = (e: React.MouseEvent, term: string) => {
    e.stopPropagation(); // Prevent the chip click handler from firing
    setSearchHistory(prevHistory => prevHistory.filter(item => item !== term));
  };

  // Check if the form is valid and can be submitted
  const isFormValid = isSearchParamsValid({
    eopjong_gbcd: selectedServiceType,
    eopjong_cd: selectedIndustries
  });

  return (
    <div className="relative space-y-5 sm:space-y-6">
      {/* Loading overlay */}
      {(isLoadingServiceTypes || isLoadingCompanySizes || isLoadingProvinces) && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-slate-900 mb-2"></div>
            <p className="text-xs sm:text-sm text-slate-700">데이터를 불러오는 중...</p>
          </div>
        </div>
      )}

      {/* Company Name Search - Separated and Emphasized */}
      <div className="bg-white rounded-lg shadow-lg border-t-4 border-blue-500">
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-800">
              업체명으로 빠른 검색
            </h2>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-12 py-3 sm:py-4 border-2 border-blue-100 rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="업체명 입력 (예: 삼성전자)"
                  style={{ fontSize: '17px' }}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full sm:w-auto sm:ml-2 bg-blue-600 hover:bg-blue-700 text-base sm:text-lg py-3 h-auto px-6"
              >
                검색
              </Button>
            </div>
            
            {/* Search History Chips */}
            {searchHistory.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {searchHistory.map((term, index) => (
                  <div 
                    key={`${term}-${index}`}
                    onClick={() => handleChipClick(term)}
                    className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    <span>{term}</span>
                    <button
                      type="button"
                      onClick={(e) => removeSearchTerm(e, term)}
                      className="ml-1.5 p-0.5 rounded-full hover:bg-blue-200 focus:outline-none"
                      aria-label={`Remove ${term}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Advanced Search Toggle Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
          className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-full text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none transition-colors"
        >
          {isAdvancedSearchOpen ? (
            <>
              <span>기본 검색만 보기</span>
              <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              <span>상세 검색 열기</span>
              <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Advanced Search Form */}
      {isAdvancedSearchOpen && (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {/* Service Type */}
            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="serviceType" className="block text-xs sm:text-sm font-medium">
                복무형태
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Select 
                value={selectedServiceType} 
                onValueChange={setSelectedServiceType} 
                disabled={isLoadingServiceTypes}
              >
                <SelectTrigger id="serviceType" className={`text-xs sm:text-sm h-9 sm:h-10 ${isLoadingServiceTypes ? "animate-pulse" : ""}`}>
                  <SelectValue placeholder="복무형태 선택" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type.code} value={type.code} className="text-xs sm:text-sm">
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedServiceType && (
                <p className="text-xs text-slate-500 mt-1">
                  선택: {serviceTypes.find(t => t.code === selectedServiceType)?.name}
                </p>
              )}
            </div>

            {/* Company Size */}
            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="companySize" className="block text-xs sm:text-sm font-medium">
                기업별
              </label>
              <Select 
                value={selectedCompanySize} 
                onValueChange={setSelectedCompanySize}
                disabled={isLoadingCompanySizes}
              >
                <SelectTrigger id="companySize" className={`text-xs sm:text-sm h-9 sm:h-10 ${isLoadingCompanySizes ? "animate-pulse" : ""}`}>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" className="text-xs sm:text-sm">전체</SelectItem>
                  {companySizes.map((size) => (
                    <SelectItem key={size.code} value={size.code} className="text-xs sm:text-sm">
                      {size.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Province */}
            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="province" className="block text-xs sm:text-sm font-medium">
                소재지 (시도)
              </label>
              <Select 
                value={selectedProvince} 
                onValueChange={setSelectedProvince}
                disabled={isLoadingProvinces}
              >
                <SelectTrigger id="province" className={`text-xs sm:text-sm h-9 sm:h-10 ${isLoadingProvinces ? "animate-pulse" : ""}`}>
                  <SelectValue placeholder="시도 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" className="text-xs sm:text-sm">전체</SelectItem>
                  {provinces.map((province) => (
                    <SelectItem key={province.code} value={province.code} className="text-xs sm:text-sm">
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="city" className="block text-xs sm:text-sm font-medium">
                소재지 (시군구)
              </label>
              <Select 
                value={selectedCity} 
                onValueChange={setSelectedCity} 
                disabled={!selectedProvince || isLoadingCities}
              >
                <SelectTrigger id="city" className={`text-xs sm:text-sm h-9 sm:h-10 ${isLoadingCities ? "animate-pulse" : ""}`}>
                  <SelectValue placeholder={selectedProvince ? "시군구 선택" : "시도를 먼저 선택하세요"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" className="text-xs sm:text-sm">전체</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city.code} value={city.code} className="text-xs sm:text-sm">
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
              className="w-full px-3 py-2 sm:px-4 sm:py-3 flex justify-between items-center bg-slate-50 hover:bg-slate-100 text-left transition-colors"
              onClick={() => setIsOptionsExpanded(!isOptionsExpanded)}
            >
              <div className="flex items-center">
                <span className="text-xs sm:text-sm font-medium">추가 옵션</span>
                {(hasRecruitment || hasActiveQuota || hasReserveQuota) && (
                  <span className="ml-2 px-1.5 py-0.5 sm:px-2 bg-blue-100 text-blue-800 text-xs rounded-full">
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
                className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 ${isOptionsExpanded ? 'transform rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isOptionsExpanded && (
              <div className="p-3 sm:p-4 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4">
                  <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-md">
                    <Checkbox
                      id="hasRecruitment"
                      checked={hasRecruitment}
                      onCheckedChange={(checked) => setHasRecruitment(checked === true)}
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                    />
                    <label htmlFor="hasRecruitment" className="text-xs sm:text-sm">
                      채용공고 등록업체
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-md">
                    <Checkbox
                      id="hasActiveQuota"
                      checked={hasActiveQuota}
                      onCheckedChange={(checked) => setHasActiveQuota(checked === true)}
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                    />
                    <label htmlFor="hasActiveQuota" className="text-xs sm:text-sm">
                      현역 배정인원
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-md">
                    <Checkbox
                      id="hasReserveQuota"
                      checked={hasReserveQuota}
                      onCheckedChange={(checked) => setHasReserveQuota(checked === true)}
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                    />
                    <label htmlFor="hasReserveQuota" className="text-xs sm:text-sm">
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
                className="w-full px-3 py-2 sm:px-4 sm:py-3 flex justify-between items-center bg-slate-50 hover:bg-slate-100 text-left transition-colors"
                onClick={() => setIsIndustriesExpanded(!isIndustriesExpanded)}
              >
                <div className="flex items-center">
                  <span className="text-xs sm:text-sm font-medium">업종선택</span>
                  <span className="ml-2 text-xs text-green-600 font-normal hidden sm:inline">(기본값: 전체 선택됨)</span>
                  {selectedIndustries.length > 0 && selectedIndustries.length < industryTypes.length && (
                    <span className="ml-2 px-1.5 py-0.5 sm:px-2 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {selectedIndustries.length}/{industryTypes.length}
                    </span>
                  )}
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 ${isIndustriesExpanded ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isIndustriesExpanded && (
                <div className="p-3 sm:p-4 border-t border-slate-200">
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
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-2 p-2 sm:p-4 border border-slate-200 rounded-md max-h-60 overflow-y-auto">
                    {industryTypes.length > 0 ? (
                      <>
                        {selectedIndustries.length === industryTypes.length && (
                          <div className="col-span-full bg-green-50 rounded-md p-2 mb-2 text-xs sm:text-sm text-green-700 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            모든 업종이 선택되었습니다
                          </div>
                        )}
                        {industryTypes.map((industry) => (
                          <div key={industry.code} className="flex items-center space-x-2 p-1.5 sm:p-2 rounded hover:bg-slate-50">
                            <Checkbox
                              id={`industry-${industry.code}`}
                              checked={selectedIndustries.includes(industry.code)}
                              onCheckedChange={() => handleIndustryToggle(industry.code)}
                              className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                            />
                            <label htmlFor={`industry-${industry.code}`} className="text-xs sm:text-sm cursor-pointer truncate">
                              {industry.name}
                            </label>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p className="text-slate-500 text-xs sm:text-sm">복무형태를 선택하면 업종이 표시됩니다.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2 sm:space-x-4">
            <Button type="button" variant="outline" onClick={resetForm} size="sm" className="text-xs sm:text-sm">
              초기화
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid || isLoadingServiceTypes || isLoadingIndustries}
              className={`text-xs sm:text-sm ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
              size="sm"
            >
              상세 검색
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SearchForm; 