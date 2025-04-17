'use client';

import React, { useState } from 'react';
import { MMAClient, CompanySearchParams, SearchResult } from 'mma-sdk';
import SearchForm from '../components/SearchForm';
import CompanyList from '../components/CompanyList';

export default function HomePage() {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<CompanySearchParams | null>(null);

  const handleSearch = async (params: CompanySearchParams) => {
    setLoading(true);
    setSearchParams(params);
    
    try {
      // Create client with proxy URL for client-side requests
      const client = new MMAClient({
        proxyUrl: window.location.origin
      });
      const result = await client.searchCompanies(params);
      setSearchResult(result);
    } catch (error) {
      console.error('Search failed:', error);
      // You could add error handling UI here
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (searchParams) {
      handleSearch({
        ...searchParams,
        pageIndex: page
      });
    }
  };

  return (
    <div className="space-y-8">
      <SearchForm onSearch={handleSearch} />
      
      <div className="mt-8">
        <CompanyList 
          searchResult={searchResult} 
          loading={loading} 
          onPageChange={handlePageChange} 
        />
      </div>
    </div>
  );
} 