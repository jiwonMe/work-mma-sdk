import type { Metadata } from 'next';
import { Suspense } from 'react';
import HomePageClient from '../components/HomePageClient';

const BASE_URL = 'https://xn--om3bq41b.com';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q;

  if (query) {
    return {
      title: `"${query}" 병역특례 업체 검색 결과`,
      description: `${query} 관련 병역특례 지정업체를 검색한 결과입니다. 산업기능요원, 전문연구요원, 승선근무예비역 지정업체 정보를 확인하세요.`,
      alternates: {
        canonical: `${BASE_URL}/?q=${encodeURIComponent(query)}`,
      },
      openGraph: {
        title: `"${query}" 병역특례 업체 검색 결과 | 병특.com`,
        description: `${query} 관련 병역특례 지정업체를 검색한 결과입니다. 산업기능요원, 전문연구요원 지정업체 정보를 확인하세요.`,
        url: `${BASE_URL}/?q=${encodeURIComponent(query)}`,
        siteName: '병특.com',
        images: [
          {
            url: `${BASE_URL}/og-image.png`,
            width: 1200,
            height: 630,
            alt: `${query} 병역특례 업체 검색 - 병특.com`,
          },
        ],
        locale: 'ko_KR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `"${query}" 병역특례 업체 검색 결과 | 병특.com`,
        description: `${query} 관련 병역특례 지정업체를 검색한 결과입니다.`,
        images: [`${BASE_URL}/og-image.png`],
      },
    };
  }

  return {
    title: '병특.com - 병역특례 지정업체 검색',
    description:
      '병역특례 지정업체를 쉽고 빠르게 검색하세요. 산업기능요원, 전문연구요원, 승선근무예비역 지정업체 정보를 제공합니다.',
    alternates: {
      canonical: BASE_URL,
    },
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialQuery = params.q || '';

  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomePageClient initialQuery={initialQuery} />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-5">
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center -mt-10">
        <div className="flex flex-col items-center mb-6 animate-pulse">
          <div className="h-10 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-48 bg-gray-100 rounded mt-2" />
        </div>
      </div>
    </main>
  );
}
