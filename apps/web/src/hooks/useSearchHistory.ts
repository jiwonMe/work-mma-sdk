import { useState, useEffect } from 'react';

const STORAGE_KEY = 'companySearchHistory';
const MAX_HISTORY = 10;

/**
 * localStorage 사용 가능 여부 확인
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * 검색 히스토리 관리 훅
 */
export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  /**
   * localStorage에서 히스토리 로드
   */
  useEffect(() => {
    if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
      try {
        const savedHistory = window.localStorage.getItem(STORAGE_KEY);
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory);
          if (Array.isArray(parsedHistory)) {
            setSearchHistory(parsedHistory);
          }
        }
      } catch (error) {
        console.error('Failed to load search history:', error);
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  /**
   * localStorage에 히스토리 저장
   */
  useEffect(() => {
    if (typeof window !== 'undefined' && isLocalStorageAvailable() && searchHistory.length > 0) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory));
      } catch (error) {
        console.error('Failed to save search history:', error);
      }
    }
  }, [searchHistory]);

  /**
   * 히스토리에 검색어 추가
   */
  const addToHistory = (term: string) => {
    if (!term || term.trim() === '') return;
    
    const trimmedName = term.trim();
    setSearchHistory(prevHistory => {
      // 중복 제거 후 맨 앞에 추가
      const filteredHistory = prevHistory.filter(item => item !== trimmedName);
      // 최대 개수 제한
      return [trimmedName, ...filteredHistory].slice(0, MAX_HISTORY);
    });
  };

  /**
   * 히스토리에서 검색어 제거
   */
  const removeFromHistory = (term: string) => {
    setSearchHistory(prevHistory => prevHistory.filter(item => item !== term));
  };

  return {
    searchHistory,
    addToHistory,
    removeFromHistory,
  };
}

