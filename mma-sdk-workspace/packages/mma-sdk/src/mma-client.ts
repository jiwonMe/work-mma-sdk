import axios from 'axios';
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

export interface MMAClientOptions {
  baseUrl?: string;
  proxyUrl?: string;
}

export class MMAClient {
  private baseUrl: string;
  private proxyUrl?: string;

  constructor(options: MMAClientOptions = {}) {
    this.baseUrl = options.baseUrl || 'https://ilteri.mma.go.kr';
    this.proxyUrl = options.proxyUrl;
  }

  /**
   * Helper function to safely parse JSON data from proxy
   */
  private safelyParseProxyResult(result: any, checkProperty: string): any {
    try {
      // First check if the response is already in the expected format
      if (result && result[checkProperty]) {
        return result;
      }

      // Then try to parse if it's wrapped in a data property
      if (result && result.data) {
        if (typeof result.data === 'string') {
          return JSON.parse(result.data);
        }
        return result.data;
      }

      // If we couldn't find the data in the expected formats, return the original
      return result;
    } catch (error) {
      console.error('Error parsing proxy response:', error);
      // Return an empty object that won't break downstream code
      return {};
    }
  }

  /**
   * Get service types (복무형태)
   */
  async getServiceTypes(): Promise<ServiceType[]> {
    if (this.proxyUrl) {
      try {
        // Client-side: use proxy
        const response = await fetch(`${this.proxyUrl}/api/mma-proxy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: '/caisBYIS/comm/selectGtcdList.json',
            params: { gongtong_gbcd: '432' },
            method: 'POST'
          })
        });
        
        const result = await response.json();
        const data = this.safelyParseProxyResult(result, 'GtCdlist');
        
        if (data && data.GtCdlist) {
          return data.GtCdlist.map((item: any) => ({
            code: item.gongtong_cd,
            name: item.gtcd_nm
          })).filter((item: ServiceType) => !item.code.startsWith('4'));
        }
      } catch (error) {
        console.error('Error getting service types:', error);
      }
      
      return [];
    } else {
      // Server-side: direct request
      const response = await axios.post(
        `${this.baseUrl}/caisBYIS/comm/selectGtcdList.json`, 
        { gongtong_gbcd: '432' },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (response.data && response.data.GtCdlist) {
        return response.data.GtCdlist.map((item: any) => ({
          code: item.gongtong_cd,
          name: item.gtcd_nm
        })).filter((item: ServiceType) => !item.code.startsWith('4'));
      }

      return [];
    }
  }

  /**
   * Get company sizes (기업별)
   */
  async getCompanySizes(): Promise<CompanySize[]> {
    if (this.proxyUrl) {
      try {
        // Client-side: use proxy
        const response = await fetch(`${this.proxyUrl}/api/mma-proxy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: '/caisBYIS/comm/selectGtcdList.json',
            params: { gongtong_gbcd: '423' },
            method: 'POST'
          })
        });
        
        const result = await response.json();
        const data = this.safelyParseProxyResult(result, 'GtCdlist');
        
        if (data && data.GtCdlist) {
          return data.GtCdlist.map((item: any) => ({
            code: item.gongtong_cd,
            name: item.gtcd_nm
          })).filter((item: CompanySize) => !item.code.startsWith('03'));
        }
      } catch (error) {
        console.error('Error getting company sizes:', error);
      }
      
      return [];
    } else {
      // Server-side: direct request
      const response = await axios.post(
        `${this.baseUrl}/caisBYIS/comm/selectGtcdList.json`, 
        { gongtong_gbcd: '423' },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (response.data && response.data.GtCdlist) {
        return response.data.GtCdlist.map((item: any) => ({
          code: item.gongtong_cd,
          name: item.gtcd_nm
        })).filter((item: CompanySize) => !item.code.startsWith('03'));
      }

      return [];
    }
  }

  /**
   * Get industry types for a service type (업종선택)
   */
  async getIndustryTypes(serviceTypeCode: string): Promise<IndustryType[]> {
    if (!serviceTypeCode) {
      return [];
    }

    if (this.proxyUrl) {
      try {
        // Client-side: use proxy
        const response = await fetch(`${this.proxyUrl}/api/mma-proxy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: '/caisBYIS/comm/selectGtcdList.json',
            params: { gongtong_gbcd: '410' },
            method: 'POST'
          })
        });
        
        const result = await response.json();
        const data = this.safelyParseProxyResult(result, 'GtCdlist');
        
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
    } else {
      // Server-side: direct request
      const response = await axios.post(
        `${this.baseUrl}/caisBYIS/comm/selectGtcdList.json`, 
        { gongtong_gbcd: '410' },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (response.data && response.data.GtCdlist) {
        return response.data.GtCdlist
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

      return [];
    }
  }

  /**
   * Get provinces/states (시도)
   */
  async getProvinces(): Promise<RegionType[]> {
    if (this.proxyUrl) {
      try {
        // Client-side: use proxy
        const response = await fetch(`${this.proxyUrl}/api/mma-proxy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: '/caisBYIS/comm/selectSidoList.json',
            params: {},
            method: 'POST'
          })
        });
        
        const result = await response.json();
        const data = this.safelyParseProxyResult(result, 'sidoList');
        
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
    } else {
      // Server-side: direct request
      const response = await axios.post(
        `${this.baseUrl}/caisBYIS/comm/selectSidoList.json`,
        {},
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (response.data && response.data.sidoList) {
        return response.data.sidoList.map((item: any) => ({
          code: item.sido_addr,
          name: item.sido_addr
        }));
      }

      return [];
    }
  }

  /**
   * Get cities/districts for a province (시군구)
   */
  async getCities(provinceCode: string): Promise<CityType[]> {
    if (!provinceCode) {
      return [];
    }

    if (this.proxyUrl) {
      try {
        // Client-side: use proxy
        const response = await fetch(`${this.proxyUrl}/api/mma-proxy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: '/caisBYIS/comm/selectSigunguList.json',
            params: { sido_addr: provinceCode },
            method: 'POST'
          })
        });
        
        const result = await response.json();
        const data = this.safelyParseProxyResult(result, 'sigunguList');
        
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
    } else {
      // Server-side: direct request
      const response = await axios.post(
        `${this.baseUrl}/caisBYIS/comm/selectSigunguList.json`,
        { sido_addr: provinceCode },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (response.data && response.data.sigunguList) {
        return response.data.sigunguList.map((item: any) => ({
          code: item.sigungu_addr,
          name: item.sigungu_addr
        }));
      }

      return [];
    }
  }

  /**
   * Search for companies with various filters
   */
  async searchCompanies(params: CompanySearchParams): Promise<SearchResult> {
    if (this.proxyUrl) {
      try {
        // Client-side: use proxy
        const response = await fetch(`${this.proxyUrl}/api/mma-proxy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: '/caisBYIS/search/byjjecgeomsaek.do',
            params,
            method: 'POST'
          })
        });
        
        const result = await response.json();
        
        // For HTML responses, we need the HTML content which should be in result.data
        const htmlData = result.data || '';
        
        // Parse the HTML response
        return this.parseSearchResults(htmlData);
      } catch (error) {
        console.error('Error searching companies:', error);
        return {
          totalCount: 0,
          currentPage: 1,
          totalPages: 1,
          companies: []
        };
      }
    } else {
      // Server-side: direct request
      // Prepare form data
      const formData = new URLSearchParams();

      if (params.eopjong_gbcd) {
        formData.append('eopjong_gbcd', params.eopjong_gbcd);
      }

      if (params.gegyumo_cd) {
        formData.append('gegyumo_cd', params.gegyumo_cd);
      }

      if (params.eopjong_cd && params.eopjong_cd.length > 0) {
        params.eopjong_cd.forEach(code => {
          formData.append('eopjong_cd', code);
        });
        
        // Add the industry codes as comma-separated list
        formData.append('eopjong_gbcd_list', params.eopjong_cd.join(','));
        formData.append('al_eopjong_gbcd', params.eopjong_cd.join(','));
      }

      if (params.eopche_nm) {
        formData.append('eopche_nm', params.eopche_nm);
      }

      if (params.sido_addr) {
        formData.append('sido_addr', params.sido_addr);
      }

      if (params.sigungu_addr) {
        formData.append('sigungu_addr', params.sigungu_addr);
      }

      if (params.chaeyongym) {
        formData.append('chaeyongym', params.chaeyongym);
      }

      if (params.bjinwonym && params.bjinwonym.length > 0) {
        params.bjinwonym.forEach(type => {
          formData.append('bjinwonym', type);
        });
      }

      if (params.pageIndex) {
        formData.append('pageIndex', params.pageIndex.toString());
      }

      // Make the search request
      const response = await axios.post(
        `${this.baseUrl}/caisBYIS/search/byjjecgeomsaek.do`,
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      // Parse the HTML response
      return this.parseSearchResults(response.data);
    }
  }

  /**
   * Parse HTML search results into structured data
   */
  private parseSearchResults(html: string): SearchResult {
    const $ = cheerio.load(html);
    const result: SearchResult = {
      totalCount: 0,
      currentPage: 1,
      totalPages: 1,
      companies: []
    };

    // Extract total count and pagination info
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

    // Extract companies
    $('.brd_list_n tbody tr').each(function() {
      // Skip rows with "조회된 게시물이 없습니다" (No results)
      if ($(this).find('td[colspan="4"]').length > 0) {
        return;
      }

      const company: Company = {
        name: ''
      };

      // Get company name and code from the link
      const linkElement = $(this).find('th.title a');
      if (linkElement.length > 0) {
        company.name = linkElement.text().trim();
        
        // Extract company code from URL if possible
        const href = linkElement.attr('href') || '';
        const codeMatch = href.match(/byjjeopche_cd=([^&]+)/);
        if (codeMatch && codeMatch[1]) {
          company.code = codeMatch[1];
        }
      }

      // Get selection year
      const tdElements = $(this).find('td');
      if (tdElements.length >= 1) {
        company.selectionYear = tdElements.eq(0).text().trim();
      }

      // Get regional office
      if (tdElements.length >= 2) {
        company.regionalOffice = tdElements.eq(1).text().trim();
      }

      // Check if recruiting
      if (tdElements.length >= 3) {
        const recruitText = tdElements.eq(2).text().trim();
        company.isRecruiting = recruitText === '모집중';
      }

      // Add the company to the results
      if (company.name) {
        result.companies.push(company);
      }
    });

    return result;
  }
} 