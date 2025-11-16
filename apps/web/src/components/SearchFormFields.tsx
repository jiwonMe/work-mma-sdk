import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ui';
import { ServiceType, CompanySize, RegionType, CityType } from 'mma-sdk';
import { cn } from 'ui';

interface SearchFormFieldsProps {
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
  onServiceTypeChange: (value: string) => void;
  onCompanySizeChange: (value: string) => void;
  onProvinceChange: (value: string) => void;
  onCityChange: (value: string) => void;
}

/**
 * 검색 폼 기본 필드 컴포넌트
 */
export const SearchFormFields: React.FC<SearchFormFieldsProps> = ({
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
  onServiceTypeChange,
  onCompanySizeChange,
  onProvinceChange,
  onCityChange,
}) => {
  return (
    <div className={cn(
      // 필드 그리드 레이아웃
      'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6'
    )}>
      {/* 복무형태 */}
      <div className={cn('space-y-1 sm:space-y-2')}>
        <label htmlFor="serviceType" className={cn(
          // 레이블 스타일
          'block text-xs sm:text-sm font-medium'
        )}>
          복무형태
          <span className={cn('text-red-500 ml-1')}>*</span>
        </label>
        <Select 
          value={selectedServiceType} 
          onValueChange={onServiceTypeChange} 
          disabled={isLoadingServiceTypes}
        >
          <SelectTrigger 
            id="serviceType" 
            className={cn(
              // 셀렉트 트리거 스타일
              'text-xs sm:text-sm h-9 sm:h-10',
              isLoadingServiceTypes ? "animate-pulse" : ""
            )}
          >
            <SelectValue placeholder="복무형태 선택" />
          </SelectTrigger>
          <SelectContent>
            {serviceTypes.map((type) => (
              <SelectItem 
                key={type.code} 
                value={type.code} 
                className={cn('text-xs sm:text-sm')}
              >
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedServiceType && (
          <p className={cn('text-xs text-slate-500 mt-1')}>
            선택: {serviceTypes.find(t => t.code === selectedServiceType)?.name}
          </p>
        )}
      </div>

      {/* 기업별 */}
      <div className={cn('space-y-1 sm:space-y-2')}>
        <label htmlFor="companySize" className={cn('block text-xs sm:text-sm font-medium')}>
          기업별
        </label>
        <Select 
          value={selectedCompanySize} 
          onValueChange={onCompanySizeChange}
          disabled={isLoadingCompanySizes}
        >
          <SelectTrigger 
            id="companySize" 
            className={cn(
              'text-xs sm:text-sm h-9 sm:h-10',
              isLoadingCompanySizes ? "animate-pulse" : ""
            )}
          >
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="" className={cn('text-xs sm:text-sm')}>전체</SelectItem>
            {companySizes.map((size) => (
              <SelectItem 
                key={size.code} 
                value={size.code} 
                className={cn('text-xs sm:text-sm')}
              >
                {size.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 소재지 (시도) */}
      <div className={cn('space-y-1 sm:space-y-2')}>
        <label htmlFor="province" className={cn('block text-xs sm:text-sm font-medium')}>
          소재지 (시도)
        </label>
        <Select 
          value={selectedProvince} 
          onValueChange={onProvinceChange}
          disabled={isLoadingProvinces}
        >
          <SelectTrigger 
            id="province" 
            className={cn(
              'text-xs sm:text-sm h-9 sm:h-10',
              isLoadingProvinces ? "animate-pulse" : ""
            )}
          >
            <SelectValue placeholder="시도 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="" className={cn('text-xs sm:text-sm')}>전체</SelectItem>
            {provinces.map((province) => (
              <SelectItem 
                key={province.code} 
                value={province.code} 
                className={cn('text-xs sm:text-sm')}
              >
                {province.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 소재지 (시군구) */}
      <div className={cn('space-y-1 sm:space-y-2')}>
        <label htmlFor="city" className={cn('block text-xs sm:text-sm font-medium')}>
          소재지 (시군구)
        </label>
        <Select 
          value={selectedCity} 
          onValueChange={onCityChange} 
          disabled={!selectedProvince || isLoadingCities}
        >
          <SelectTrigger 
            id="city" 
            className={cn(
              'text-xs sm:text-sm h-9 sm:h-10',
              isLoadingCities ? "animate-pulse" : ""
            )}
          >
            <SelectValue 
              placeholder={selectedProvince ? "시군구 선택" : "시도를 먼저 선택하세요"} 
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="" className={cn('text-xs sm:text-sm')}>전체</SelectItem>
            {cities.map((city) => (
              <SelectItem 
                key={city.code} 
                value={city.code} 
                className={cn('text-xs sm:text-sm')}
              >
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

