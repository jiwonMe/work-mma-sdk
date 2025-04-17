import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

export async function POST(request: Request) {
  try {
    const { endpoint, params, method = 'POST' } = await request.json();
    
    // Create a custom HTTPS agent that ignores certificate errors
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });
    
    // Make the actual request from the server
    const baseUrl = 'https://work.mma.go.kr';
    const url = `${baseUrl}${endpoint}`;
    
    console.log('Proxying request to:', url);

    let response;
    if (method === 'POST') {
      response = await axios.post(
        url, 
        new URLSearchParams(params as Record<string, string>).toString(), 
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          httpsAgent
        }
      );
    } else {
      // For GET requests
      response = await axios.get(url, {
        params,
        httpsAgent
      });
    }
    
    // Check the content type to determine if we need to send the raw data
    const contentType = response.headers['content-type'] || '';
    
    // If it's an HTML response, return it as text
    if (contentType.includes('text/html')) {
      return NextResponse.json({ data: response.data });
    }
    
    // If it's JSON, return the raw data without wrapping it again
    // This prevents double nesting of the data structure
    if (contentType.includes('application/json')) {
      return NextResponse.json(response.data);
    }
    
    // Default fallback
    return NextResponse.json({ data: response.data });
  } catch (error) {
    console.error('Proxy error:', error);
    // Add more detailed error information for debugging
    const axiosError = error as any;
    return NextResponse.json(
      { 
        error: 'Failed to proxy request',
        details: axiosError.message,
        url: axiosError.config?.url,
        status: axiosError.response?.status
      },
      { status: 500 }
    );
  }
} 