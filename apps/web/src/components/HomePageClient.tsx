'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SearchForm from './SearchForm';
import CompanyList from './CompanyList';
import { SearchRanking } from './SearchRanking';
import { useSearch } from '../hooks';
import { cn } from 'ui';
import { trackRankingKeywordClick, trackShare, trackPagination } from '../utils/analytics';

interface HomePageClientProps {
  initialQuery: string;
}

export default function HomePageClient({ initialQuery }: HomePageClientProps) {
  const router = useRouter();
  const [{ searchResult, loading, error, lastSearchTime }, handleSearch, handlePageChange] =
    useSearch();
  const [copied, setCopied] = useState(false);

  const hasResults = searchResult || loading;

  // URL에서 검색어 읽어서 자동 검색
  useEffect(() => {
    if (initialQuery && !searchResult && !loading) {
      handleSearch({
        eopjong_gbcd: '',
        eopjong_cd: [],
        eopche_nm: initialQuery,
        pageIndex: 1,
      });
    }
  }, [initialQuery]);

  // 검색 핸들러 - URL 업데이트 포함
  const handleSearchWithUrl = async (params: any) => {
    if (params.eopche_nm) {
      router.push(`/?q=${encodeURIComponent(params.eopche_nm)}`, { scroll: false });
    }
    await handleSearch(params);
  };

  // 인기 검색어 클릭 핸들러
  const handleRankingSelect = (keyword: string, rank?: number) => {
    if (rank !== undefined) {
      trackRankingKeywordClick(keyword, rank);
    }

    router.push(`/?q=${encodeURIComponent(keyword)}`, { scroll: false });
    handleSearch({
      eopjong_gbcd: '',
      eopjong_cd: [],
      eopche_nm: keyword,
      pageIndex: 1,
    });
  };

  // 공유 버튼 클릭 핸들러
  const handleShare = async () => {
    const url = window.location.href;
    const currentQuery = initialQuery || '';

    trackShare(currentQuery);

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
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
          <div className={cn('max-w-6xl mx-auto px-4')}>
            <div className={cn('flex items-center justify-between h-12')}>
              <a href="/" className={cn('flex items-center')}>
                <Image
                  src="/logo.svg"
                  alt="병특.com"
                  width={80}
                  height={30}
                  className={cn('h-6 w-auto')}
                />
              </a>
              <div className={cn('flex items-center gap-3')}>
                {searchResult && (
                  <button
                    onClick={handleShare}
                    className={cn(
                      // 기본 스타일
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors',
                      // 상태별 스타일
                      copied
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    {copied ? (
                      <>
                        <svg
                          className={cn('w-3.5 h-3.5')}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        복사됨
                      </>
                    ) : (
                      <>
                        <svg
                          className={cn('w-3.5 h-3.5')}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
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
      <main
        className={cn(
          // 기본 스타일
          'flex-1 w-full mx-auto px-4 py-5',
          // 검색 결과 유무에 따른 최대 너비
          hasResults ? 'max-w-6xl' : 'max-w-4xl'
        )}
      >
        {/* 초기 화면 - 검색 전 */}
        {!hasResults && (
          <div
            className={cn(
              // 레이아웃
              'min-h-[calc(100vh-200px)] flex flex-col justify-center -mt-10',
              // 간격
              'space-y-4'
            )}
          >
            {/* 로고 */}
            <div className={cn('flex flex-col items-center mb-6')}>
              <Image
                src="/logo.svg"
                alt="병특.com"
                width={160}
                height={60}
                className={cn('h-10 w-auto')}
                priority
              />
              <p className={cn('text-sm text-gray-400 mt-2')}>병역특례 지정업체 검색 서비스</p>
            </div>

            {/* 실시간 인기 검색어 - 검색창 위 */}
            <div className={cn('mb-4')}>
              <SearchRanking
                onSelect={handleRankingSelect}
                variant="horizontal"
                limit={10}
                title="인기 검색"
              />
            </div>

            {/* 검색폼 */}
            <SearchForm onSearch={handleSearchWithUrl} initialQuery={initialQuery} />
          </div>
        )}

        {/* 검색 결과 화면 */}
        {hasResults && (
          <div
            className={cn(
              // 레이아웃
              'flex gap-6',
              // 반응형
              'flex-col lg:flex-row'
            )}
          >
            {/* 왼쪽: 검색 결과 영역 */}
            <div className={cn('flex-1 space-y-4 min-w-0')}>
              {/* 모바일: 인기 검색어 (검색창 위) */}
              <div className={cn('lg:hidden')}>
                <SearchRanking
                  onSelect={handleRankingSelect}
                  variant="horizontal"
                  limit={10}
                  title="인기 검색"
                />
              </div>

              <SearchForm onSearch={handleSearchWithUrl} initialQuery={initialQuery} />

              {error && (
                <div
                  className={cn(
                    // 레이아웃
                    'flex items-center gap-2 px-3 py-2.5',
                    // 스타일
                    'bg-red-50 border border-red-100 rounded-lg',
                    // 텍스트
                    'text-sm text-red-600'
                  )}
                >
                  <svg
                    className={cn('h-4 w-4 text-red-400')}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
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

            {/* 데스크톱: 사이드바 - 실시간 인기 검색어 */}
            <aside
              className={cn(
                // 너비
                'w-full lg:w-72',
                // 반응형 표시
                'hidden lg:block',
                // 고정 위치
                'lg:sticky lg:top-20 lg:self-start'
              )}
            >
              <SearchRanking
                onSelect={handleRankingSelect}
                variant="vertical"
                limit={10}
                title="인기 검색"
              />
            </aside>
          </div>
        )}
      </main>
    </>
  );
}

