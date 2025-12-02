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

export const SearchFormFields: React.FC<SearchFormFieldsProps> = ({
  serviceTypes, companySizes, provinces, cities,
  isLoadingServiceTypes, isLoadingCompanySizes, isLoadingProvinces, isLoadingCities,
  selectedServiceType, selectedCompanySize, selectedProvince, selectedCity,
  onServiceTypeChange, onCompanySizeChange, onProvinceChange, onCityChange,
}) => {
  return (
    <div className={cn('grid grid-cols-2 gap-3')}>
      <div className={cn('space-y-1.5')}>
        <label className={cn('text-xs font-medium text-gray-500')}>
          복무형태 <span className={cn('text-red-400')}>*</span>
        </label>
        <Select value={selectedServiceType} onValueChange={onServiceTypeChange} disabled={isLoadingServiceTypes}>
          <SelectTrigger className={isLoadingServiceTypes ? 'animate-pulse' : ''}>
            <SelectValue placeholder="선택" />
          </SelectTrigger>
          <SelectContent>
            {serviceTypes.map((type) => (
              <SelectItem key={type.code} value={type.code}>{type.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={cn('space-y-1.5')}>
        <label className={cn('text-xs font-medium text-gray-500')}>기업별</label>
        <Select value={selectedCompanySize} onValueChange={onCompanySizeChange} disabled={isLoadingCompanySizes}>
          <SelectTrigger className={isLoadingCompanySizes ? 'animate-pulse' : ''}>
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">전체</SelectItem>
            {companySizes.map((size) => (
              <SelectItem key={size.code} value={size.code}>{size.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={cn('space-y-1.5')}>
        <label className={cn('text-xs font-medium text-gray-500')}>소재지 (시도)</label>
        <Select value={selectedProvince} onValueChange={onProvinceChange} disabled={isLoadingProvinces}>
          <SelectTrigger className={isLoadingProvinces ? 'animate-pulse' : ''}>
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">전체</SelectItem>
            {provinces.map((province) => (
              <SelectItem key={province.code} value={province.code}>{province.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={cn('space-y-1.5')}>
        <label className={cn('text-xs font-medium text-gray-500')}>소재지 (시군구)</label>
        <Select value={selectedCity} onValueChange={onCityChange} disabled={!selectedProvince || isLoadingCities}>
          <SelectTrigger className={isLoadingCities ? 'animate-pulse' : ''}>
            <SelectValue placeholder={selectedProvince ? '선택' : '시도 먼저 선택'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">전체</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city.code} value={city.code}>{city.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
