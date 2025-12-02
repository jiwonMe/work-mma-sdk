import React from 'react';

const BASE_URL = 'https://xn--om3bq41b.com';

interface WebsiteJsonLdProps {
  searchQuery?: string;
}

export function WebsiteJsonLd({ searchQuery }: WebsiteJsonLdProps) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '병특.com',
    alternateName: ['병특닷컴', '병역특례 검색', '산업기능요원 검색'],
    url: BASE_URL,
    description: '병역특례 지정업체 검색 서비스 - 산업기능요원, 전문연구요원, 승선근무예비역 지정업체를 쉽고 빠르게 검색하세요.',
    inLanguage: 'ko-KR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '병특.com',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.svg`,
    description: '병역특례 지정업체 검색 서비스',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'park@jiwon.me',
      contactType: 'customer service',
    },
  };

  const breadcrumbSchema = searchQuery
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: '홈',
            item: BASE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: `"${searchQuery}" 검색 결과`,
            item: `${BASE_URL}/?q=${encodeURIComponent(searchQuery)}`,
          },
        ],
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
    </>
  );
}

export function SearchResultJsonLd({
  query,
  totalCount,
  companies,
}: {
  query: string;
  totalCount: number;
  companies: Array<{ name: string; address?: string }>;
}) {
  const searchResultSchema = {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: `"${query}" 병역특례 업체 검색 결과`,
    description: `${query} 관련 병역특례 지정업체 ${totalCount}개 검색 결과`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalCount,
      itemListElement: companies.slice(0, 10).map((company, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Organization',
          name: company.name,
          address: company.address,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(searchResultSchema) }}
    />
  );
}

export function FAQJsonLd() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '병역특례란 무엇인가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '병역특례는 산업기능요원, 전문연구요원, 승선근무예비역 등으로 병역의무를 대체 이행하는 제도입니다. 지정된 업체에서 일정 기간 근무하면 현역 복무를 대체할 수 있습니다.',
        },
      },
      {
        '@type': 'Question',
        name: '산업기능요원이란?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '산업기능요원은 중소기업, IT기업 등에서 기술인력으로 근무하며 병역의무를 이행하는 제도입니다. 보통 3년간 지정업체에서 근무해야 합니다.',
        },
      },
      {
        '@type': 'Question',
        name: '전문연구요원이란?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '전문연구요원은 석사 이상의 학위를 가진 자가 연구기관에서 연구원으로 근무하며 병역의무를 이행하는 제도입니다.',
        },
      },
      {
        '@type': 'Question',
        name: '병특.com에서 무엇을 할 수 있나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '병특.com에서는 병무청에 등록된 병역특례 지정업체를 쉽고 빠르게 검색할 수 있습니다. 회사명, 업종, 지역 등으로 검색하여 원하는 업체 정보를 확인하세요.',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

