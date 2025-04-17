import { useState, useCallback } from 'react';
import { CompanySearchParams, SearchResult } from 'mma-sdk';
import { searchCompanies, createSearchParamsWithPage, SearchState } from '../services/searchService';

/**
 * Hook for managing search state and operations
 */
export function useSearch(): [
  SearchState,
  (params: CompanySearchParams) => Promise<void>,
  (page: number) => void
] {
  const [state, setState] = useState<SearchState>({
    searchResult: null,
    loading: false,
    searchParams: null,
    error: null,
    lastSearchTime: null
  });
  
  // Handle search
  const handleSearch = useCallback(async (params: CompanySearchParams) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    await searchCompanies(params, {
      onSearchStart: () => {
        setState(prev => ({ 
          ...prev, 
          loading: true, 
          searchParams: params,
          error: null 
        }));
      },
      onSearchSuccess: (result: SearchResult, searchParams: CompanySearchParams) => {
        setState(prev => ({
          ...prev,
          searchResult: result,
          searchParams,
          lastSearchTime: new Date()
        }));
      },
      onSearchError: (error) => {
        setState(prev => ({
          ...prev,
          error: '검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          searchResult: null
        }));
      },
      onSearchComplete: () => {
        setState(prev => ({ ...prev, loading: false }));
      }
    });
  }, []);
  
  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    if (state.searchParams) {
      const newParams = createSearchParamsWithPage(state.searchParams, page);
      if (newParams) {
        handleSearch(newParams);
      }
    }
  }, [state.searchParams, handleSearch]);
  
  return [state, handleSearch, handlePageChange];
} 