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
export function trackSearch(searchTerm: string, resultCount: number, params: any) {
  trackEvent('search', {
    searchTerm,
    resultCount,
    params: JSON.stringify(params)
  });
}

/**
 * Track a search error event
 */
export function trackSearchError(error: any, params: any) {
  trackEvent('search_error', {
    error: error?.message || String(error),
    params: JSON.stringify(params)
  });
} 