import React from 'react';
import './globals.css';
import Image from 'next/image';
import { Analytics } from '@vercel/analytics/react';

const BASE_URL = 'https://xn--om3bq41b.com';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: '병특.com',
  description: '병역특례 지정업체 검색 서비스',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: '병특.com',
    description: '병역특례 지정업체 검색 서비스',
    url: BASE_URL,
    siteName: '병특.com',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: '병특.com - 병역특례 지정업체 검색 서비스',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '병특.com',
    description: '병역특례 지정업체 검색 서비스',
    images: [`${BASE_URL}/og-image.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link 
          rel="preload" 
          as="style" 
          crossOrigin="anonymous" 
          href="https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.3/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.min.css" 
        />
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.3/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.min.css" 
        />
      </head>
      <body className="min-h-screen bg-[#fafafa] flex flex-col">
        {children}
        
        {/* Vercel Web Analytics */}
        <Analytics />

        {/* Footer - Sticky Bottom */}
        <footer className="border-t border-gray-100 bg-white mt-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <Image 
                  src="/logo.svg" 
                  alt="병특.com" 
                  width={70} 
                  height={26}
                  className="h-5 w-auto opacity-40"
                />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                <a href="https://mma.go.kr" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">
                  병무청
                </a>
                <a href="https://work.mma.go.kr/caisBYIS/search/byjjecgeomsaek.do" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">
                  원본 검색 사이트
                </a>
                <a href="https://github.com/jiwonMe/work-mma-sdk" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">
                  GitHub
                </a>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <div className="flex flex-col sm:flex-row justify-between gap-2 text-xs text-gray-400">
                <p>© 2025 병특.com · 데이터 출처: 병무청</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-gray-300">
                  <span>본 서비스는 병무청 공개 데이터를 활용하여 제공됩니다.</span>
                  <span className="text-gray-300">·</span>
                  <a href="mailto:park@jiwon.me" className="hover:text-gray-500 transition-colors">
                    개발자: park@jiwon.me
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
