'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';
import { useEffect } from 'react';

export default function Header() {
  const { user, isAuthenticated, logout, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <header className="bg-[#1A1A1A] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-wider">
          Nafal
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/auctions" className="text-sm hover:text-gray-300 transition">
            경매
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/mypage" className="text-sm hover:text-gray-300 transition">
                마이페이지
              </Link>
              {user?.role === 'ADMIN' && (
                <Link href="/admin" className="text-sm hover:text-gray-300 transition">
                  관리자
                </Link>
              )}
              <button
                onClick={logout}
                className="text-sm bg-white/10 px-4 py-1.5 rounded hover:bg-white/20 transition"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm bg-white text-black px-4 py-1.5 rounded font-medium hover:bg-gray-200 transition"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
