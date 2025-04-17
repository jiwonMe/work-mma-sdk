import React from 'react';
import './globals.css';

export const metadata = {
  title: '병특.com',
  description: '병역특례 지정업체 검색 서비스',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
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
      <body>
        <div className="container mx-auto py-4 px-3 sm:py-10 sm:px-4">
          <header className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center">병특.com</h1>
            <p className="text-center text-slate-600 mt-2 text-sm sm:text-base">병역특례 지정업체 검색 서비스</p>
          </header>
          <main>{children}</main>
          <footer className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-slate-500">
            <p>© 2023 병특.com - 병역특례 지정업체 검색 서비스</p>
          </footer>
        </div>
      </body>
    </html>
  );
} 