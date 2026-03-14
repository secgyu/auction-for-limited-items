'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/format';
import type { DashboardStats } from '@/types';

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<DashboardStats>('/admin/dashboard')
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const statCards = [
    { label: '총 회원', value: data.stats.totalUsers, color: 'bg-blue-50 text-blue-700' },
    { label: '총 상품', value: data.stats.totalProducts, color: 'bg-purple-50 text-purple-700' },
    { label: '총 경매', value: data.stats.totalAuctions, color: 'bg-green-50 text-green-700' },
    { label: '진행중 경매', value: data.stats.activeAuctions, color: 'bg-yellow-50 text-yellow-700' },
    { label: '총 입찰', value: data.stats.totalBids, color: 'bg-red-50 text-red-700' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className={`rounded-xl p-4 ${card.color}`}>
            <p className="text-xs font-medium opacity-70 mb-1">{card.label}</p>
            <p className="text-2xl font-bold">{card.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <h2 className="font-bold text-lg mb-3">최근 입찰</h2>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">입찰자</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">상품</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">금액</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">시간</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.recentBids.map((bid) => (
              <tr key={bid.id}>
                <td className="px-4 py-3">{bid.bidder?.name}</td>
                <td className="px-4 py-3">{bid.auction?.product?.title}</td>
                <td className="px-4 py-3 text-right font-medium">{formatPrice(bid.amount)}</td>
                <td className="px-4 py-3 text-right text-gray-400">{formatDate(bid.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
