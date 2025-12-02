import { track } from '@vercel/analytics';

/**
 * Track a custom event with Vercel Analytics
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  track(eventName, properties);
}

/**
 * Track a search event
 */
export function trackSearch(params: {
  searchTerm: string;
  serviceType?: string;
  resultCount: number;
  pageIndex: number;
}) {
  trackEvent('search', {
    search_term: params.searchTerm,
    service_type: params.serviceType || 'all',
    result_count: params.resultCount,
    page_index: params.pageIndex,
  });
}

/**
 * Track a search error event
 */
export function trackSearchError(error: any, searchTerm?: string) {
  trackEvent('search_error', {
    error: error?.message || String(error),
    search_term: searchTerm || 'unknown',
  });
}

/**
 * Track when a company card is clicked/viewed
 */
export function trackCompanyView(companyName: string, companyCode?: string) {
  trackEvent('company_view', {
    company_name: companyName,
    company_code: companyCode || 'unknown',
  });
}

/**
 * Track popular search keyword click
 */
export function trackRankingKeywordClick(keyword: string, rank: number) {
  trackEvent('ranking_keyword_click', {
    keyword,
    rank,
  });
}

/**
 * Track share button click
 */
export function trackShare(searchTerm: string) {
  trackEvent('share', {
    search_term: searchTerm,
    url: typeof window !== 'undefined' ? window.location.href : 'unknown',
  });
}

/**
 * Track search history usage
 */
export function trackSearchHistoryUsed(keyword: string) {
  trackEvent('search_history_used', {
    keyword,
  });
}

/**
 * Track tab switch (quick search / advanced search)
 */
export function trackTabSwitch(tab: 'quick' | 'advanced') {
  trackEvent('tab_switch', {
    tab,
  });
}

/**
 * Track pagination
 */
export function trackPagination(page: number, searchTerm?: string) {
  trackEvent('pagination', {
    page,
    search_term: searchTerm || 'unknown',
  });
}
