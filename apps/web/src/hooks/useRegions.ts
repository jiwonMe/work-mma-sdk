import { useState, useEffect } from 'react';
import { MMAClient, RegionType, CityType } from 'mma-sdk';

/**
 * 지역(시도/시군구) 목록 로딩 훅
 */
export function useRegions(proxyUrl?: string) {
  const [provinces, setProvinces] = useState<RegionType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  // 시도 목록 로딩
  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const client = new MMAClient({ proxyUrl });
        const provincesList = await client.getProvinces();
        setProvinces(provincesList);
      } catch (error) {
        console.error('Failed to load provinces:', error);
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, [proxyUrl]);

  // 시군구 목록 로딩 (시도 선택 시)
  useEffect(() => {
    const loadCities = async () => {
      if (!selectedProvince) {
        setCities([]);
        setSelectedCity('');
        return;
      }

      setIsLoadingCities(true);
      try {
        const client = new MMAClient({ proxyUrl });
        const citiesList = await client.getCities(selectedProvince);
        setCities(citiesList);
      } catch (error) {
        console.error('Failed to load cities:', error);
      } finally {
        setIsLoadingCities(false);
      }
    };

    loadCities();
  }, [selectedProvince, proxyUrl]);

  /**
   * 시도 변경 핸들러 (시군구 초기화)
   */
  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedCity(''); // 시도 변경 시 시군구 초기화
  };

  return {
    provinces,
    cities,
    isLoadingProvinces,
    isLoadingCities,
    selectedProvince,
    selectedCity,
    setSelectedProvince: handleProvinceChange,
    setSelectedCity
  };
}

