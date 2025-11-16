import { useState, useEffect } from 'react';
import { MMAClient, ServiceType } from 'mma-sdk';

/**
 * 복무형태 목록 로딩 훅
 */
export function useServiceTypes(proxyUrl?: string) {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');

  useEffect(() => {
    const loadServiceTypes = async () => {
      setIsLoading(true);
      try {
        const client = new MMAClient({ proxyUrl });
        const types = await client.getServiceTypes();
        setServiceTypes(types);
        
        // 기본값 설정
        if (types.length > 0) {
          setSelectedServiceType(types[0].code);
        }
      } catch (error) {
        console.error('Failed to load service types:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadServiceTypes();
  }, [proxyUrl]);

  return {
    serviceTypes,
    isLoading,
    selectedServiceType,
    setSelectedServiceType
  };
}

