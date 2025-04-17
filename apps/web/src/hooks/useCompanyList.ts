import { useState, useMemo } from 'react';
import { Company, SearchResult } from 'mma-sdk';

interface CompanyDetails extends Company {
  address?: string;
  industryType?: string;
  activeQuota?: string | number;
  reserveQuota?: string | number;
}

interface UseCompanyListReturn {
  selectedCompany: CompanyDetails | null;
  pageNumbers: number[];
  handleCompanySelect: (company: Company) => void;
}

export function useCompanyList(searchResult: SearchResult | null): UseCompanyListReturn {
  const [selectedCompany, setSelectedCompany] = useState<CompanyDetails | null>(null);
  
  // Handle company selection for details view
  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company === selectedCompany ? null : company as CompanyDetails);
  };
  
  // Calculate pagination numbers
  const pageNumbers = useMemo(() => {
    if (!searchResult) return [];
    
    const totalPages = searchResult.totalPages;
    const currentPage = searchResult.currentPage;
    
    // Simple case: 5 or fewer pages
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // More complex case: current page is near start
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }
    
    // Near end
    if (currentPage >= totalPages - 2) {
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    
    // Middle
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  }, [searchResult]);
  
  return {
    selectedCompany,
    pageNumbers,
    handleCompanySelect
  };
} 