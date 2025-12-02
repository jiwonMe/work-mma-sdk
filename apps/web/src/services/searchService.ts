import { MMAClient, CompanySearchParams, SearchResult, Company, ServiceTypeCode } from 'mma-sdk';
import { trackSearch, trackSearchError } from '../utils/analytics';
import { recordSearchKeyword } from '../hooks/useSearchRanking';

// 복무형태 코드 상수
const SERVICE_TYPE_CODES = {
  // 산업기능요원
  INDUSTRIAL: '1',
  // 전문연구요원/전문기능요원
  PROFESSIONAL: '2',
} as const;

export interface SearchState {
  searchResult: SearchResult | null;
  loading: boolean;
  searchParams: CompanySearchParams | null;
  error: string | null;
  lastSearchTime: Date | null;
}

export interface SearchCallbacks {
  onSearchStart: () => void;
  onSearchSuccess: (result: SearchResult, params: CompanySearchParams) => void;
  onSearchError: (error: any) => void;
  onSearchComplete: () => void;
}

/**
 * 단일 복무형태로 검색
 */
async function searchByServiceType(
  client: MMAClient,
  params: CompanySearchParams,
  serviceTypeCode: string,
  serviceType: ServiceTypeCode
): Promise<Company[]> {
  const result = await client.searchCompanies({
    ...params,
    eopjong_gbcd: serviceTypeCode,
  });
  
  // 각 회사에 복무형태 태깅
  return result.companies.map(company => ({
    ...company,
    serviceType,
  }));
}

/**
 * 산업기능요원과 전문기능요원 모두 병렬 검색 후 결과 병합
 */
async function searchBothServiceTypes(
  client: MMAClient,
  params: CompanySearchParams
): Promise<SearchResult> {
  // 산업기능요원, 전문기능요원 병렬 검색
  const [industrialCompanies, professionalCompanies] = await Promise.all([
    searchByServiceType(
      client,
      params,
      SERVICE_TYPE_CODES.INDUSTRIAL,
      'industrial'
    ),
    searchByServiceType(
      client,
      params,
      SERVICE_TYPE_CODES.PROFESSIONAL,
      'professional'
    ),
  ]);

  // 결과 병합 - 중복 제거 (code 기준)
  const companyMap = new Map<string, Company>();
  
  // 산업기능요원 먼저 추가
  industrialCompanies.forEach(company => {
    const key = company.code || company.name;
    companyMap.set(key, company);
  });
  
  // 전문기능요원 추가 (중복 시 both로 표시하거나 기존 유지)
  professionalCompanies.forEach(company => {
    const key = company.code || company.name;
    if (!companyMap.has(key)) {
      companyMap.set(key, company);
    }
  });

  const companies = Array.from(companyMap.values());
  
  // 총 개수는 두 결과의 합이 아닌 실제 병합된 결과 수
  const totalCount = companies.length;
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const currentPage = params.pageIndex || 1;

  return {
    totalCount,
    currentPage,
    totalPages,
    companies,
  };
}

/**
 * Search for companies using MMA SDK
 * 산업기능요원과 전문기능요원 모두 검색
 */
export async function searchCompanies(
  params: CompanySearchParams,
  callbacks?: Partial<SearchCallbacks>
): Promise<SearchResult | null> {
  callbacks?.onSearchStart?.();
  
  try {
    // Create client with proxy URL for client-side requests
    const client = new MMAClient({
      proxyUrl: typeof window !== 'undefined' ? window.location.origin : undefined
    });
    
    // 산업기능요원 + 전문기능요원 모두 검색
    const result = await searchBothServiceTypes(client, params);
    
    // Track successful search with Vercel Analytics
    if (result) {
      trackSearch({
        searchTerm: params.eopche_nm || '',
        serviceType: 'both',
        resultCount: result.totalCount,
        pageIndex: params.pageIndex || 1,
      });

      // 검색어 순위 기록 - 검색 결과가 있는 경우에만 (비동기, 실패해도 검색 결과에 영향 없음)
      if (params.eopche_nm && result.totalCount > 0) {
        recordSearchKeyword(params.eopche_nm).catch(() => {});
      }
    }
    
    callbacks?.onSearchSuccess?.(result, params);
    
    // Scroll to results if there are any
    if (result && result.companies.length > 0 && typeof window !== 'undefined') {
      setTimeout(() => {
        const resultElement = document.getElementById('search-results');
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
    
    return result;
  } catch (error) {
    console.error('Search failed:', error);
    
    // Track search error with Vercel Analytics
    trackSearchError(error, params.eopche_nm);
    
    callbacks?.onSearchError?.(error);
    return null;
  } finally {
    callbacks?.onSearchComplete?.();
  }
}

/**
 * Create a search params object with the page index
 */
export function createSearchParamsWithPage(
  params: CompanySearchParams | null, 
  pageIndex: number
): CompanySearchParams | null {
  if (!params) return null;
  
  return {
    ...params,
    pageIndex
  };
}

/**
 * Check if the search form has valid required parameters
 */
export function isSearchParamsValid(params: CompanySearchParams): boolean {
  // Check if the required fields are present
  return !!(
    params.eopjong_gbcd && 
    (params.eopjong_cd?.length ?? 0) > 0
  );
} 