import { useState, useEffect } from 'react';
import { MMAClient, ServiceType, CompanySize, IndustryType, RegionType, CityType } from 'mma-sdk';

interface FormDataState {
  // Data states
  serviceTypes: ServiceType[];
  companySizes: CompanySize[];
  industryTypes: IndustryType[];
  provinces: RegionType[];
  cities: CityType[];
  
  // Loading states
  isLoadingServiceTypes: boolean;
  isLoadingCompanySizes: boolean;
  isLoadingIndustries: boolean;
  isLoadingProvinces: boolean;
  isLoadingCities: boolean;

  // Selected values
  selectedServiceType: string;
  selectedCompanySize: string;
  selectedIndustries: string[];
  companyName: string;
  selectedProvince: string;
  selectedCity: string;
  hasRecruitment: boolean;
  hasActiveQuota: boolean;
  hasReserveQuota: boolean;
}

interface FormDataActions {
  setSelectedServiceType: (value: string) => void;
  setSelectedCompanySize: (value: string) => void;
  setSelectedIndustries: (value: string[]) => void;
  setCompanyName: (value: string) => void;
  setSelectedProvince: (value: string) => void;
  setSelectedCity: (value: string) => void;
  setHasRecruitment: (value: boolean) => void;
  setHasActiveQuota: (value: boolean) => void;
  setHasReserveQuota: (value: boolean) => void;
  handleIndustryToggle: (code: string) => void;
  handleToggleAllIndustries: () => void;
  resetForm: () => void;
}

export function useFormData(): [FormDataState, FormDataActions] {
  const [mmaClient] = useState(() => new MMAClient({
    proxyUrl: typeof window !== 'undefined' ? window.location.origin : undefined
  }));
  
  // Data states
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [companySizes, setCompanySizes] = useState<CompanySize[]>([]);
  const [industryTypes, setIndustryTypes] = useState<IndustryType[]>([]);
  const [provinces, setProvinces] = useState<RegionType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);
  
  // Loading states
  const [isLoadingServiceTypes, setIsLoadingServiceTypes] = useState(true);
  const [isLoadingCompanySizes, setIsLoadingCompanySizes] = useState(true);
  const [isLoadingIndustries, setIsLoadingIndustries] = useState(false);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Form values
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  const [selectedCompanySize, setSelectedCompanySize] = useState<string>('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [hasRecruitment, setHasRecruitment] = useState<boolean>(false);
  const [hasActiveQuota, setHasActiveQuota] = useState<boolean>(false);
  const [hasReserveQuota, setHasReserveQuota] = useState<boolean>(false);

  // Load service types, company sizes, and provinces on mount
  useEffect(() => {
    const loadServiceTypes = async () => {
      setIsLoadingServiceTypes(true);
      try {
        const types = await mmaClient.getServiceTypes();
        setServiceTypes(types);
        // Set a default service type if available
        if (types.length > 0) {
          setSelectedServiceType(types[0].code);
        }
      } catch (error) {
        console.error('Failed to load service types:', error);
      } finally {
        setIsLoadingServiceTypes(false);
      }
    };

    const loadCompanySizes = async () => {
      setIsLoadingCompanySizes(true);
      try {
        const sizes = await mmaClient.getCompanySizes();
        setCompanySizes(sizes);
      } catch (error) {
        console.error('Failed to load company sizes:', error);
      } finally {
        setIsLoadingCompanySizes(false);
      }
    };

    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const provinces = await mmaClient.getProvinces();
        setProvinces(provinces);
      } catch (error) {
        console.error('Failed to load provinces:', error);
      } finally {
        setIsLoadingProvinces(false);
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

      setIsLoadingIndustries(true);
      try {
        const types = await mmaClient.getIndustryTypes(selectedServiceType);
        setIndustryTypes(types);
        
        // Automatically select all industry types
        if (types.length > 0) {
          setSelectedIndustries(types.map(type => type.code));
        }
      } catch (error) {
        console.error('Failed to load industry types:', error);
      } finally {
        setIsLoadingIndustries(false);
      }
    };

    loadIndustryTypes();
  }, [selectedServiceType, mmaClient]);

  // Load cities when province changes
  useEffect(() => {
    const loadCities = async () => {
      if (!selectedProvince) {
        setCities([]);
        setSelectedCity('');
        return;
      }

      setIsLoadingCities(true);
      try {
        const cities = await mmaClient.getCities(selectedProvince);
        setCities(cities);
      } catch (error) {
        console.error('Failed to load cities:', error);
      } finally {
        setIsLoadingCities(false);
      }
    };

    loadCities();
  }, [selectedProvince, mmaClient]);

  // Handle industry toggle
  const handleIndustryToggle = (code: string) => {
    setSelectedIndustries((prev) => {
      if (prev.includes(code)) {
        return prev.filter((c) => c !== code);
      } else {
        return [...prev, code];
      }
    });
  };

  // Handle select/deselect all industries
  const handleToggleAllIndustries = () => {
    if (selectedIndustries.length === industryTypes.length) {
      // If all are selected, deselect all
      setSelectedIndustries([]);
    } else {
      // Else select all
      setSelectedIndustries(industryTypes.map(industry => industry.code));
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    // Preserve the service type but reset everything else
    setSelectedCompanySize('');
    setCompanyName('');
    setSelectedProvince('');
    setSelectedCity('');
    setHasRecruitment(false);
    setHasActiveQuota(false);
    setHasReserveQuota(false);
    
    // Reload industry types to reset to all selected
    if (selectedServiceType) {
      mmaClient.getIndustryTypes(selectedServiceType)
        .then(types => {
          setIndustryTypes(types);
          setSelectedIndustries(types.map(type => type.code));
        })
        .catch(error => console.error('Failed to reload industry types:', error));
    }
  };

  return [
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
      setSelectedIndustries,
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
  ];
} 