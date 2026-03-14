'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import AuctionCard from '@/components/auction/AuctionCard';
import type { Auction, PaginatedResponse } from '@/types';

const TABS = [
  { key: '', label: '전체' },
  { key: 'SCHEDULED', label: '경매 예정' },
  { key: 'ACTIVE', label: '진행중' },
  { key: 'ENDED', label: '마감' },
];

export default function AuctionsPage() {
  const [activeTab, setActiveTab] = useState('');
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = { page: String(page), limit: '12' };
        if (activeTab) params.status = activeTab;
        const { data } = await api.get<PaginatedResponse<Auction>>('/auctions', { params });
        setAuctions(data.data);
        setTotalPages(data.meta.totalPages);
      } catch {
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, [activeTab, page]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">경매 리스트</h1>

      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px ${
              activeTab === tab.key
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
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
      ) : auctions.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">등록된 경매가 없습니다</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {auctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                    p === page
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
