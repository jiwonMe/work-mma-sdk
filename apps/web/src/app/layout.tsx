import './globals.css';

export const metadata = {
  title: 'MMA SDK Demo',
  description: 'Military Manpower Administration SDK Demo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div className="container mx-auto py-10 px-4">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-center">병역지정업체 검색 데모</h1>
            <p className="text-center text-slate-600 mt-2">MMA SDK를 이용한 병역지정업체 검색 데모</p>
          </header>
          <main>{children}</main>
          <footer className="mt-12 text-center text-sm text-slate-500">
            <p>This is a demo application using MMA SDK</p>
          </footer>
        </div>
      </body>
    </html>
  );
} 