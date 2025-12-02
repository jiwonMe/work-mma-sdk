import { MMAClient, CompanySearchParams, SearchResult } from 'mma-sdk';
import { trackSearch, trackSearchError } from '../utils/analytics';
import { recordSearchKeyword } from '../hooks/useSearchRanking';

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
 * Search for companies using MMA SDK
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
    
    const result = await client.searchCompanies(params);
    
    // Track successful search with Vercel Analytics
    if (result) {
      trackSearch(
        params.eopjong_gbcd || 'unknown',
        result.companies.length,
        params
      );

      // 검색어 순위 기록 (비동기, 실패해도 검색 결과에 영향 없음)
      if (params.eopche_nm) {
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
    trackSearchError(error, params);
    
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