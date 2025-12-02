'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import SearchForm from '../components/SearchForm';
import CompanyList from '../components/CompanyList';
import { useSearch } from '../hooks';
import { cn } from 'ui';

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [{ searchResult, loading, error, lastSearchTime }, handleSearch, handlePageChange] = useSearch();
  const [copied, setCopied] = useState(false);

  const hasResults = searchResult || loading;

  // URL에서 검색어 읽어서 자동 검색
  useEffect(() => {
    const query = searchParams.get('q');
    if (query && !searchResult && !loading) {
      handleSearch({
        eopjong_gbcd: '',
        eopjong_cd: [],
        eopche_nm: query,
        pageIndex: 1
      });
    }
  }, [searchParams]);

  // 검색 핸들러 - URL 업데이트 포함
  const handleSearchWithUrl = async (params: any) => {
    // URL 업데이트
    if (params.eopche_nm) {
      router.push(`/?q=${encodeURIComponent(params.eopche_nm)}`, { scroll: false });
    }
    await handleSearch(params);
  };

  // 공유 버튼 클릭 핸들러
  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* Header - 검색 시작 후에만 표시 */}
      {hasResults && (
        <header className={cn('sticky top-0 z-50 bg-white border-b border-gray-100')}>
          <div className={cn('max-w-4xl mx-auto px-4')}>
            <div className={cn('flex items-center justify-between h-12')}>
              <a 
                href="/"
                className={cn('flex items-center')}
              >
                <Image 
                  src="/logo.svg" 
                  alt="병특.com" 
                  width={80} 
                  height={30}
                  className={cn('h-6 w-auto')}
                />
              </a>
              <div className={cn('flex items-center gap-3')}>
                {/* 공유 버튼 */}
                {searchResult && (
                  <button
                    onClick={handleShare}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors',
                      copied 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    {copied ? (
                      <>
                        <svg className={cn('w-3.5 h-3.5')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        복사됨
                      </>
                    ) : (
                      <>
                        <svg className={cn('w-3.5 h-3.5')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        공유
                      </>
                    )}
                  </button>
                )}
                <a 
                  href="https://mma.go.kr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={cn('text-sm text-gray-400 hover:text-gray-600 transition-colors')}
                >
                  병무청 →
                </a>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main */}
      <main className={cn('flex-1 max-w-4xl w-full mx-auto px-4 py-5')}>
        <div className={cn(
          'space-y-4',
          !hasResults && 'min-h-[calc(100vh-200px)] flex flex-col justify-center -mt-10'
        )}>
          {/* 첫 화면 로고 - 검색 전에만 표시 */}
          {!hasResults && (
            <div className={cn('flex flex-col items-center mb-6')}>
              <Image 
                src="/logo.svg" 
                alt="병특.com" 
                width={160} 
                height={60}
                className={cn('h-10 w-auto')}
                priority
              />
              <p className={cn('text-sm text-gray-400 mt-2')}>
                병역특례 지정업체 검색 서비스
              </p>
            </div>
          )}

          <SearchForm onSearch={handleSearchWithUrl} initialQuery={searchParams.get('q') || ''} />

          {error && (
            <div className={cn(
              'flex items-center gap-2 px-3 py-2.5',
              'bg-red-50 border border-red-100 rounded-lg',
              'text-sm text-red-600'
            )}>
              <svg className={cn('h-4 w-4 text-red-400')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <CompanyList
            searchResult={searchResult}
            loading={loading}
            onPageChange={handlePageChange}
          />

          {lastSearchTime && searchResult && (
            <p className={cn('text-right text-xs text-gray-400')}>
              마지막 검색: {lastSearchTime.toLocaleString()}
            </p>
          )}
        </div>
      </main>
    </>
  );
}
