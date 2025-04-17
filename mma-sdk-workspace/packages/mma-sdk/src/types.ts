// Types for MMA SDK

export interface ServiceType {
  code: string;
  name: string;
}

export interface CompanySize {
  code: string;
  name: string;
}

export interface IndustryType {
  code: string;
  name: string;
  checked?: boolean;
}

export interface RegionType {
  code: string;
  name: string;
}

export interface CityType {
  code: string;
  name: string;
}

export interface CompanySearchParams {
  eopjong_gbcd?: string; // Service type code
  gegyumo_cd?: string; // Company size code
  eopjong_cd?: string[]; // Selected industry codes
  eopche_nm?: string; // Company name
  sido_addr?: string; // Province/state
  sigungu_addr?: string; // City/district
  chaeyongym?: string; // Has recruitment (Y)
  bjinwonym?: string[]; // Remaining quota (H: 현역, B: 보충역)
  pageIndex?: number; // Page number
}

export interface Company {
  name: string;
  code?: string;
  selectionYear?: string;
  regionalOffice?: string;
  isRecruiting?: boolean;
}

export interface SearchResult {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  companies: Company[];
} 