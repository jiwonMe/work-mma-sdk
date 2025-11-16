import axios, { AxiosInstance } from 'axios';

export interface HTTPClientOptions {
  baseUrl: string;
  proxyUrl?: string;
}

/**
 * HTTP 요청 클라이언트 (프록시/직접 요청 통합)
 */
export class HTTPClient {
  private baseUrl: string;
  private proxyUrl?: string;
  private axiosInstance: AxiosInstance;

  constructor(options: HTTPClientOptions) {
    this.baseUrl = options.baseUrl;
    this.proxyUrl = options.proxyUrl;
    
    // Node.js 환경에서만 HTTPS 에이전트 생성
    let httpsAgent;
    if (typeof window === 'undefined') {
      try {
        const https = require('https');
        httpsAgent = new https.Agent({
          rejectUnauthorized: false
        });
      } catch (e) {
        // https 모듈을 사용할 수 없는 경우 무시
      }
    }

    this.axiosInstance = axios.create({
      ...(httpsAgent && { httpsAgent }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  /**
   * 프록시 응답 안전하게 파싱
   */
  private safelyParseProxyResult(result: any, checkProperty: string): any {
    try {
      if (result && result[checkProperty]) {
        return result;
      }
      if (result && result.data) {
        if (typeof result.data === 'string') {
          return JSON.parse(result.data);
        }
        return result.data;
      }
      return result;
    } catch (error) {
      console.error('Error parsing proxy response:', error);
      return {};
    }
  }

  /**
   * POST 요청 실행
   */
  async post<T>(
    endpoint: string,
    params: Record<string, any>,
    checkProperty?: string
  ): Promise<T> {
    if (this.proxyUrl) {
      return this.postViaProxy<T>(endpoint, params, checkProperty);
    } else {
      return this.postDirect<T>(endpoint, params);
    }
  }

  /**
   * 프록시를 통한 POST 요청
   */
  private async postViaProxy<T>(
    endpoint: string,
    params: Record<string, any>,
    checkProperty?: string
  ): Promise<T> {
    try {
      const response = await fetch(`${this.proxyUrl}/api/mma-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          endpoint,
          params,
          method: 'POST'
        })
      });
      
      const result = await response.json();
      
      if (checkProperty) {
        return this.safelyParseProxyResult(result, checkProperty) as T;
      }
      
      return result as T;
    } catch (error) {
      console.error(`Error posting via proxy to ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * 직접 POST 요청
   */
  private async postDirect<T>(
    endpoint: string,
    params: Record<string, any>
  ): Promise<T> {
    const formData = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => formData.append(key, String(item)));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await this.axiosInstance.post<T>(
      `${this.baseUrl}${endpoint}`,
      formData.toString()
    );

    return response.data;
  }

  /**
   * HTML 응답을 문자열로 반환
   */
  async postHTML(endpoint: string, params: Record<string, any>): Promise<string> {
    if (this.proxyUrl) {
      const result = await this.postViaProxy<{ data: string }>(endpoint, params);
      return result.data || '';
    } else {
      const formData = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(item => formData.append(key, String(item)));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const response = await this.axiosInstance.post(
        `${this.baseUrl}${endpoint}`,
        formData.toString()
      );

      return response.data;
    }
  }
}

