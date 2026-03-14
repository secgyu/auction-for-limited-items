'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '@/lib/format';
import type { Auction, PaginatedResponse } from '@/types';

export default function AdminAuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<PaginatedResponse<Auction>>('/auctions?limit=50')
      .then((res) => setAuctions(res.data.data))
      .catch(() => toast.error('경매 목록을 불러올 수 없습니다'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">경매 관리</h1>
        <Link
          href="/admin/auctions/new"
          className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          + 경매 등록
        </Link>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">상품</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">상태</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">시작가</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">현재가</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">입찰수</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">시작</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">종료</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auctions.map((auction) => (
                <tr key={auction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 truncate max-w-[200px]">
                    {auction.product?.title}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(auction.status)}`}>
                      {getStatusLabel(auction.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{formatPrice(auction.startPrice)}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatPrice(auction.currentPrice)}</td>
                  <td className="px-4 py-3 text-right">{auction._count?.bids ?? 0}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(auction.startTime)}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(auction.endTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
