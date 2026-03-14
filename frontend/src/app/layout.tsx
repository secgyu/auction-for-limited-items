import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nafal - 믿을 수 있는 가치 플랫폼',
  description: '갖고 싶은 한정판 제품은 다 나팔에서. 자원 순환 경매 플랫폼.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col bg-[#FAFAFA] text-gray-900">
        <Toaster position="top-center" />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
