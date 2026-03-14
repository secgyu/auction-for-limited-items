'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import AuctionCard from '@/components/auction/AuctionCard';
import type { Auction, PaginatedResponse } from '@/types';

export default function HomePage() {
  const [activeAuctions, setActiveAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<PaginatedResponse<Auction>>('/auctions', {
      params: { status: 'ACTIVE', limit: '8' },
    })
      .then((res) => setActiveAuctions(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* 히어로 섹션 */}
      <section className="bg-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <p className="text-sm tracking-widest text-gray-400 mb-4">
            자원 순환 플랫폼
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Nafal
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-2">
            믿을 수 있는 가치 플랫폼
          </p>
          <p className="text-gray-400 mb-10">
            갖고 싶은 한정판 제품은 다 나팔에서
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/auctions"
              className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              경매 둘러보기
            </Link>
            <Link
              href="/auth/register"
              className="border border-white/30 px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition"
            >
              회원가입
            </Link>
          </div>
        </div>
      </section>

      {/* 가치 제안 */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              ♻️
            </div>
            <h3 className="font-bold mb-2">재품의 가치 재발견</h3>
            <p className="text-sm text-gray-500">
              사용하지 않는 자산이 가치있는 상품으로 변환됩니다
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              💰
            </div>
            <h3 className="font-bold mb-2">합리적인 소비</h3>
            <p className="text-sm text-gray-500">
              경매를 통해 합리적인 가격에 원하는 상품을 소유하세요
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              🌍
            </div>
            <h3 className="font-bold mb-2">지속가능한 미래</h3>
            <p className="text-sm text-gray-500">
              특별한 소비가 지속가능한 미래를 만듭니다
            </p>
          </div>
        </div>
      </section>

      {/* 진행중 경매 */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">진행중인 경매</h2>
          <Link
            href="/auctions?status=ACTIVE"
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            전체 보기 →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-xl" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-5 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activeAuctions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-400 mb-2">현재 진행중인 경매가 없습니다</p>
            <Link href="/auctions" className="text-sm text-gray-900 font-medium hover:underline">
              예정된 경매 확인하기 →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activeAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
