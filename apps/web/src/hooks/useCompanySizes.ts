import { useState, useEffect } from 'react';
import { MMAClient, CompanySize } from 'mma-sdk';

/**
 * 기업별 목록 로딩 훅
 */
export function useCompanySizes(proxyUrl?: string) {
  const [companySizes, setCompanySizes] = useState<CompanySize[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompanySize, setSelectedCompanySize] = useState<string>('');

  useEffect(() => {
    const loadCompanySizes = async () => {
      setIsLoading(true);
      try {
        const client = new MMAClient({ proxyUrl });
        const sizes = await client.getCompanySizes();
        setCompanySizes(sizes);
      } catch (error) {
        console.error('Failed to load company sizes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanySizes();
  }, [proxyUrl]);

  return {
    companySizes,
    isLoading,
    selectedCompanySize,
    setSelectedCompanySize
  };
}

