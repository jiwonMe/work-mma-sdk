import { useState, useEffect } from 'react';
import { MMAClient, IndustryType } from 'mma-sdk';

/**
 * 업종 목록 로딩 훅
 */
export function useIndustryTypes(
  serviceTypeCode: string,
  proxyUrl?: string
) {
  const [industryTypes, setIndustryTypes] = useState<IndustryType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  useEffect(() => {
    const loadIndustryTypes = async () => {
      if (!serviceTypeCode) {
        setIndustryTypes([]);
        setSelectedIndustries([]);
        return;
      }

      setIsLoading(true);
      try {
        const client = new MMAClient({ proxyUrl });
        const types = await client.getIndustryTypes(serviceTypeCode);
        setIndustryTypes(types);
        
        // 기본값: 전체 선택
        if (types.length > 0) {
          setSelectedIndustries(types.map(type => type.code));
        }
      } catch (error) {
        console.error('Failed to load industry types:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadIndustryTypes();
  }, [serviceTypeCode, proxyUrl]);

  /**
   * 업종 토글
   */
  const handleIndustryToggle = (code: string) => {
    setSelectedIndustries((prev) => {
      if (prev.includes(code)) {
        return prev.filter((c) => c !== code);
      } else {
        return [...prev, code];
      }
    });
  };

  /**
   * 전체 선택/해제
   */
  const handleToggleAllIndustries = () => {
    if (selectedIndustries.length === industryTypes.length) {
      setSelectedIndustries([]);
    } else {
      setSelectedIndustries(industryTypes.map(industry => industry.code));
    }
  };

  /**
   * 업종 목록 리셋 (전체 선택)
   */
  const resetIndustries = () => {
    if (industryTypes.length > 0) {
      setSelectedIndustries(industryTypes.map(type => type.code));
    }
  };

  return {
    industryTypes,
    isLoading,
    selectedIndustries,
    setSelectedIndustries,
    handleIndustryToggle,
    handleToggleAllIndustries,
    resetIndustries
  };
}

