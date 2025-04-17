'use client';

import React from 'react';
import SearchForm from '../components/SearchForm';
import CompanyList from '../components/CompanyList';
import { useSearch } from '../hooks';

export default function HomePage() {
  const [{ searchResult, loading, error, lastSearchTime }, handleSearch, handlePageChange] = useSearch();

  return (
    <div className="space-y-4 sm:space-y-8">
      <SearchForm onSearch={handleSearch} />
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-md" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div id="search-results" className="mt-4 sm:mt-8">
        <CompanyList 
          searchResult={searchResult} 
          loading={loading} 
          onPageChange={handlePageChange} 
        />
        
        {lastSearchTime && searchResult && (
          <div className="mt-2 sm:mt-4 text-xs text-right text-slate-500">
            마지막 검색 시간: {lastSearchTime.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
} 