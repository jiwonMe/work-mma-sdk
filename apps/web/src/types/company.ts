import { Company } from 'mma-sdk';

/**
 * 확장된 Company 타입 (상세 정보 포함)
 */
export interface CompanyDetails extends Company {
  address?: string;
  industryType?: string;
  activeQuota?: string | number;
  reserveQuota?: string | number;
}

