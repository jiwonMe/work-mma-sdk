'use client';

import React, { useState, useCallback } from 'react';
import { MMAClient, CompanySearchParams, SearchResult } from 'mma-sdk';
import SearchForm from '../components/SearchForm';
import CompanyList from '../components/CompanyList';

export default function HomePage() {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<CompanySearchParams | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastSearchTime, setLastSearchTime] = useState<Date | null>(null);

  const handleSearch = useCallback(async (params: CompanySearchParams) => {
    setLoading(true);
    setSearchParams(params);
    setError(null);
    
    try {
      // Create client with proxy URL for client-side requests
      const client = new MMAClient({
        proxyUrl: window.location.origin
      });
      const result = await client.searchCompanies(params);
      setSearchResult(result);
      setLastSearchTime(new Date());
      
      // Scroll to results if there are any
      if (result && result.companies.length > 0) {
        setTimeout(() => {
          const resultElement = document.getElementById('search-results');
          if (resultElement) {
            resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setError('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePageChange = useCallback((page: number) => {
    if (searchParams) {
      handleSearch({
        ...searchParams,
        pageIndex: page
      });
    }
  }, [searchParams, handleSearch]);

  return (
    <div className="space-y-8">
      <SearchForm onSearch={handleSearch} />
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div id="search-results" className="mt-8">
        <CompanyList 
          searchResult={searchResult} 
          loading={loading} 
          onPageChange={handlePageChange} 
        />
        
        {lastSearchTime && searchResult && (
          <div className="mt-4 text-xs text-right text-slate-500">
            마지막 검색 시간: {lastSearchTime.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
} 