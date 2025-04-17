import React, { useState, useEffect } from 'react';
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Checkbox } from 'ui';
import { MMAClient, ServiceType, CompanySize, IndustryType, RegionType, CityType } from 'mma-sdk';

interface SearchFormProps {
  onSearch: (params: any) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [mmaClient] = useState(() => new MMAClient({
    proxyUrl: typeof window !== 'undefined' ? window.location.origin : undefined
  }));
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [companySizes, setCompanySizes] = useState<CompanySize[]>([]);
  const [industryTypes, setIndustryTypes] = useState<IndustryType[]>([]);
  const [provinces, setProvinces] = useState<RegionType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);

  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  const [selectedCompanySize, setSelectedCompanySize] = useState<string>('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [hasRecruitment, setHasRecruitment] = useState<boolean>(false);
  const [hasActiveQuota, setHasActiveQuota] = useState<boolean>(false);
  const [hasReserveQuota, setHasReserveQuota] = useState<boolean>(false);

  // Load service types on mount
  useEffect(() => {
    const loadServiceTypes = async () => {
      try {
        const types = await mmaClient.getServiceTypes();
        setServiceTypes(types);
      } catch (error) {
        console.error('Failed to load service types:', error);
      }
    };

    const loadCompanySizes = async () => {
      try {
        const sizes = await mmaClient.getCompanySizes();
        setCompanySizes(sizes);
      } catch (error) {
        console.error('Failed to load company sizes:', error);
      }
    };

    const loadProvinces = async () => {
      try {
        const provinces = await mmaClient.getProvinces();
        setProvinces(provinces);
      } catch (error) {
        console.error('Failed to load provinces:', error);
      }
    };

    loadServiceTypes();
    loadCompanySizes();
    loadProvinces();
  }, [mmaClient]);

  // Load industry types when service type changes
  useEffect(() => {
    const loadIndustryTypes = async () => {
      if (!selectedServiceType) {
        setIndustryTypes([]);
        return;
      }

      try {
        const types = await mmaClient.getIndustryTypes(selectedServiceType);
        setIndustryTypes(types);
      } catch (error) {
        console.error('Failed to load industry types:', error);
      }
    };

    loadIndustryTypes();
  }, [selectedServiceType, mmaClient]);

  // Load cities when province changes
  useEffect(() => {
    const loadCities = async () => {
      if (!selectedProvince) {
        setCities([]);
        return;
      }

      try {
        const cities = await mmaClient.getCities(selectedProvince);
        setCities(cities);
      } catch (error) {
        console.error('Failed to load cities:', error);
      }
    };

    loadCities();
  }, [selectedProvince, mmaClient]);

  const handleServiceTypeChange = (value: string) => {
    setSelectedServiceType(value);
    setSelectedIndustries([]);
  };

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedCity('');
  };

  const handleIndustryToggle = (code: string) => {
    setSelectedIndustries((prev) => {
      if (prev.includes(code)) {
        return prev.filter((c) => c !== code);
      } else {
        return [...prev, code];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare search parameters
    const bjinwonym: string[] = [];
    if (hasActiveQuota) bjinwonym.push('H');
    if (hasReserveQuota) bjinwonym.push('B');

    const searchParams = {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service Type */}
        <div className="space-y-2">
          <label htmlFor="serviceType" className="block text-sm font-medium">
            복무형태 *
          </label>
          <Select value={selectedServiceType} onValueChange={handleServiceTypeChange}>
            <SelectTrigger id="serviceType">
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
        </div>

        {/* Company Size */}
        <div className="space-y-2">
          <label htmlFor="companySize" className="block text-sm font-medium">
            기업별
          </label>
          <Select value={selectedCompanySize} onValueChange={setSelectedCompanySize}>
            <SelectTrigger id="companySize">
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

        {/* Company Name */}
        <div className="space-y-2">
          <label htmlFor="companyName" className="block text-sm font-medium">
            업체명
          </label>
          <input
            id="companyName"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-md"
            placeholder="업체명 입력"
          />
        </div>

        {/* Province */}
        <div className="space-y-2">
          <label htmlFor="province" className="block text-sm font-medium">
            소재지 (시도)
          </label>
          <Select value={selectedProvince} onValueChange={handleProvinceChange}>
            <SelectTrigger id="province">
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
          <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedProvince}>
            <SelectTrigger id="city">
              <SelectValue placeholder="시군구 선택" />
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

        {/* Options */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium mb-2">추가 옵션</label>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasRecruitment"
                checked={hasRecruitment}
                onCheckedChange={(checked) => setHasRecruitment(checked === true)}
              />
              <label htmlFor="hasRecruitment" className="text-sm">
                채용공고 등록업체
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasActiveQuota"
                checked={hasActiveQuota}
                onCheckedChange={(checked) => setHasActiveQuota(checked === true)}
              />
              <label htmlFor="hasActiveQuota" className="text-sm">
                현역 배정인원
              </label>
            </div>
            <div className="flex items-center space-x-2">
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
      </div>

      {/* Industry Types */}
      {selectedServiceType && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">업종선택</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-4 border border-slate-200 rounded-md max-h-60 overflow-y-auto">
            {industryTypes.length > 0 ? (
              industryTypes.map((industry) => (
                <div key={industry.code} className="flex items-center space-x-2">
                  <Checkbox
                    id={`industry-${industry.code}`}
                    checked={selectedIndustries.includes(industry.code)}
                    onCheckedChange={() => handleIndustryToggle(industry.code)}
                  />
                  <label htmlFor={`industry-${industry.code}`} className="text-sm">
                    {industry.name}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">복무형태를 선택하면 업종이 표시됩니다.</p>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => window.location.reload()}>
          초기화
        </Button>
        <Button type="submit" disabled={!selectedServiceType || selectedIndustries.length === 0}>
          검색
        </Button>
      </div>
    </form>
  );
};

export default SearchForm; 