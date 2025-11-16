/**
 * 업체명을 정리하고 Wanted 검색 URL을 생성하는 유틸리티 함수
 */
export const getWantedSearchUrl = (companyName: string): string => {
  // "(주)", "주식회사" 등의 용어 제거
  const cleanedName = companyName
    .replace(/(\(주\)|주식회사|㈜|（주）)/g, '')
    .trim();
  
  // Wanted 검색 URL 생성
  return `https://www.wanted.co.kr/search?query=${encodeURIComponent(cleanedName)}`;
};

