import * as cheerio from 'cheerio';
import { 
  ServiceType, 
  CompanySize, 
  IndustryType, 
  RegionType, 
  CityType, 
  CompanySearchParams, 
  Company, 
  SearchResult 
} from './types';
import { HTTPClient } from './http-client';

export interface MMAClientOptions {
  baseUrl?: string;
  proxyUrl?: string;
}

/**
 * MMA API 클라이언트
 */
export class MMAClient {
  private httpClient: HTTPClient;

  constructor(options: MMAClientOptions = {}) {
    const baseUrl = options.baseUrl || 'https://work.mma.go.kr';
    this.httpClient = new HTTPClient({
      baseUrl,
      proxyUrl: options.proxyUrl
    });
  }

  /**
   * 복무형태 목록 조회
   */
  async getServiceTypes(): Promise<ServiceType[]> {
    try {
      const data = await this.httpClient.post<{ GtCdlist: any[] }>(
        '/caisBYIS/comm/selectGtcdList.json',
        { gongtong_gbcd: '432' },
        'GtCdlist'
      );
      
      if (data && data.GtCdlist) {
        return data.GtCdlist
          .map((item: any) => ({
            code: item.gongtong_cd,
            name: item.gtcd_nm
          }))
          .filter((item: ServiceType) => !item.code.startsWith('4'));
      }
    } catch (error) {
      console.error('Error getting service types:', error);
    }
    
    return [];
  }

  /**
   * 기업별 목록 조회
   */
  async getCompanySizes(): Promise<CompanySize[]> {
    try {
      const data = await this.httpClient.post<{ GtCdlist: any[] }>(
        '/caisBYIS/comm/selectGtcdList.json',
        { gongtong_gbcd: '423' },
        'GtCdlist'
      );
      
      if (data && data.GtCdlist) {
        return data.GtCdlist
          .map((item: any) => ({
            code: item.gongtong_cd,
            name: item.gtcd_nm
          }))
          .filter((item: CompanySize) => !item.code.startsWith('03'));
      }
    } catch (error) {
      console.error('Error getting company sizes:', error);
    }
    
    return [];
  }

  /**
   * 업종 목록 조회 (복무형태별)
   */
  async getIndustryTypes(serviceTypeCode: string): Promise<IndustryType[]> {
    if (!serviceTypeCode) {
      return [];
    }

    try {
      const data = await this.httpClient.post<{ GtCdlist: any[] }>(
        '/caisBYIS/comm/selectGtcdList.json',
        { gongtong_gbcd: '410' },
        'GtCdlist'
      );
      
      if (data && data.GtCdlist) {
        return data.GtCdlist
          .filter((item: any) => {
            const code = item.gongtong_cd;
            return code.startsWith(serviceTypeCode) &&
                  code.substring(1, 5) !== '0000' &&
                  !code.startsWith('12') &&
                  !code.startsWith('13') &&
                  !code.startsWith('14') &&
                  code.substring(2, 5) !== '000' &&
                  code.substring(3, 5) !== '00';
          })
          .map((item: any) => ({
            code: item.gongtong_cd,
            name: item.gtcd_nm
          }));
      }
    } catch (error) {
      console.error('Error getting industry types:', error);
    }
    
    return [];
  }

  /**
   * 시도 목록 조회
   */
  async getProvinces(): Promise<RegionType[]> {
    try {
      const data = await this.httpClient.post<{ sidoList: any[] }>(
        '/caisBYIS/comm/selectSidoList.json',
        {},
        'sidoList'
      );
      
      if (data && data.sidoList) {
        return data.sidoList.map((item: any) => ({
          code: item.sido_addr,
          name: item.sido_addr
        }));
      }
    } catch (error) {
      console.error('Error getting provinces:', error);
    }
    
    return [];
  }

  /**
   * 시군구 목록 조회 (시도별)
   */
  async getCities(provinceCode: string): Promise<CityType[]> {
    if (!provinceCode) {
      return [];
    }

    try {
      const data = await this.httpClient.post<{ sigunguList: any[] }>(
        '/caisBYIS/comm/selectSigunguList.json',
        { sido_addr: provinceCode },
        'sigunguList'
      );
      
      if (data && data.sigunguList) {
        return data.sigunguList.map((item: any) => ({
          code: item.sigungu_addr,
          name: item.sigungu_addr
        }));
      }
    } catch (error) {
      console.error('Error getting cities:', error);
    }
    
    return [];
  }

  /**
   * 업체 검색
   */
  async searchCompanies(params: CompanySearchParams): Promise<SearchResult> {
    try {
      // 검색 파라미터 준비
      const searchParams: Record<string, any> = {};

      if (params.eopjong_gbcd) {
        searchParams.eopjong_gbcd = params.eopjong_gbcd;
      }

      if (params.gegyumo_cd) {
        searchParams.gegyumo_cd = params.gegyumo_cd;
      }

      if (params.eopjong_cd && params.eopjong_cd.length > 0) {
        searchParams.eopjong_cd = params.eopjong_cd;
        searchParams.eopjong_gbcd_list = params.eopjong_cd.join(',');
        searchParams.al_eopjong_gbcd = params.eopjong_cd.join(',');
      }

      if (params.eopche_nm) {
        searchParams.eopche_nm = params.eopche_nm;
      }

      if (params.sido_addr) {
        searchParams.sido_addr = params.sido_addr;
      }

      if (params.sigungu_addr) {
        searchParams.sigungu_addr = params.sigungu_addr;
      }

      if (params.chaeyongym) {
        searchParams.chaeyongym = params.chaeyongym;
      }

      if (params.bjinwonym && params.bjinwonym.length > 0) {
        searchParams.bjinwonym = params.bjinwonym;
      }

      if (params.pageIndex) {
        searchParams.pageIndex = params.pageIndex.toString();
      }

      // HTML 응답 받기
      const html = await this.httpClient.postHTML(
        '/caisBYIS/search/byjjecgeomsaek.do',
        searchParams
      );

      // HTML 파싱
      return this.parseSearchResults(html);
    } catch (error) {
      console.error('Error searching companies:', error);
      return {
        totalCount: 0,
        currentPage: 1,
        totalPages: 1,
        companies: []
      };
    }
  }

  /**
   * HTML 검색 결과 파싱
   */
  private parseSearchResults(html: string): SearchResult {
    const $ = cheerio.load(html);
    const result: SearchResult = {
      totalCount: 0,
      currentPage: 1,
      totalPages: 1,
      companies: []
    };

    // 총 개수 및 페이지 정보 추출
    const topicsText = $('.topics').text();
    const countMatch = topicsText.match(/총 게시물 : (\d+)건/);
    if (countMatch && countMatch[1]) {
      result.totalCount = parseInt(countMatch[1], 10);
    }

    const pageMatch = topicsText.match(/\((\d+)\/(\d+) 페이지\)/);
    if (pageMatch && pageMatch[1] && pageMatch[2]) {
      result.currentPage = parseInt(pageMatch[1], 10);
      result.totalPages = parseInt(pageMatch[2], 10);
    }

    // 업체 정보 추출
    $('.brd_list_n tbody tr').each(function() {
      // "조회된 게시물이 없습니다" 행 건너뛰기
      if ($(this).find('td[colspan="4"]').length > 0) {
        return;
      }

      const company: Company = {
        name: ''
      };

      // 업체명 및 코드 추출
      const linkElement = $(this).find('th.title a');
      if (linkElement.length > 0) {
        company.name = linkElement.text().trim();
        
        const href = linkElement.attr('href') || '';
        const codeMatch = href.match(/byjjeopche_cd=([^&]+)/);
        if (codeMatch && codeMatch[1]) {
          company.code = codeMatch[1];
        }
      }

      // 테이블 셀 데이터 추출
      const tdElements = $(this).find('td');
      if (tdElements.length >= 1) {
        company.selectionYear = tdElements.eq(0).text().trim();
      }
      if (tdElements.length >= 2) {
        company.regionalOffice = tdElements.eq(1).text().trim();
      }
      if (tdElements.length >= 3) {
        const recruitText = tdElements.eq(2).text().trim();
        company.isRecruiting = recruitText === '모집중';
      }

      // 업체명이 있는 경우만 추가
      if (company.name) {
        result.companies.push(company);
      }
    });

    return result;
  }
}
