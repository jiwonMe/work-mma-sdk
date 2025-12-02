import React from 'react';
import './globals.css';
import Image from 'next/image';
import { Analytics } from '@vercel/analytics/react';
import { WebsiteJsonLd, FAQJsonLd } from '../components/JsonLd';
import type { Metadata, Viewport } from 'next';

const BASE_URL = 'https://xn--om3bq41b.com';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: '병특.com - 병역특례 지정업체 검색',
    template: '%s | 병특.com',
  },
  description:
    '병역특례 지정업체를 쉽고 빠르게 검색하세요. 산업기능요원, 전문연구요원, 승선근무예비역 지정업체 정보를 제공합니다. 네이버, 카카오, 토스 등 IT기업부터 제조업까지 모든 병특 업체를 검색할 수 있습니다.',
  keywords: [
    '병역특례',
    '산업기능요원',
    '전문연구요원',
    '승선근무예비역',
    '병특',
    '병특업체',
    '병역특례업체',
    '현역대체복무',
    '병무청',
    'IT기업 병특',
    '스타트업 병특',
    '병역특례 검색',
    '병특닷컴',
  ],
  authors: [{ name: '병특.com', url: BASE_URL }],
  creator: 'park@jiwon.me',
  publisher: '병특.com',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: '병특.com - 병역특례 지정업체 검색',
    description:
      '병역특례 지정업체를 쉽고 빠르게 검색하세요. 산업기능요원, 전문연구요원, 승선근무예비역 지정업체 정보를 제공합니다.',
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
    title: '병특.com - 병역특례 지정업체 검색',
    description:
      '병역특례 지정업체를 쉽고 빠르게 검색하세요. 산업기능요원, 전문연구요원 지정업체 정보를 제공합니다.',
    images: [`${BASE_URL}/og-image.png`],
    creator: '@jiwonme',
  },
  verification: {
    google: 'your-google-verification-code', // Google Search Console 인증 코드
    other: {
      'naver-site-verification': '1d35179efa523417ffe2aefd2264b9b236bf557a',
    },
  },
  category: '정보 서비스',
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
        {/* 구조화된 데이터 (JSON-LD) */}
        <WebsiteJsonLd />
        <FAQJsonLd />
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
                <a
                  href="https://mma.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-600 transition-colors"
                >
                  병무청
                </a>
                <a
                  href="https://work.mma.go.kr/caisBYIS/search/byjjecgeomsaek.do"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-600 transition-colors"
                >
                  원본 검색 사이트
                </a>
                <a
                  href="https://github.com/jiwonMe/work-mma-sdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-600 transition-colors"
                >
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
