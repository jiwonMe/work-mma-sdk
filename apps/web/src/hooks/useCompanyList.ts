import { useState } from 'react';
import { Company, SearchResult } from 'mma-sdk';
import { CompanyDetails } from '../types/company';

interface UseCompanyListReturn {
  selectedCompany: CompanyDetails | null;
  handleCompanySelect: (company: Company) => void;
}

/**
 * 업체 목록 관련 상태 관리 훅
 */
export function useCompanyList(searchResult: SearchResult | null): UseCompanyListReturn {
  const [selectedCompany, setSelectedCompany] = useState<CompanyDetails | null>(null);
  
  /**
   * 업체 선택/해제 핸들러
   */
  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company === selectedCompany ? null : company as CompanyDetails);
  };
  
  return {
    selectedCompany,
    handleCompanySelect
  };
} 