'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import type { Product, PaginatedResponse } from '@/types';

export default function NewAuctionPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    productId: '',
    startPrice: '',
    bidIncrement: '1000',
    startTime: '',
    endTime: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get<PaginatedResponse<Product>>('/products?limit=100')
      .then((res) => {
        const available = res.data.data.filter((p) => !p.auction);
        setProducts(available);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auctions', {
        productId: form.productId,
        startPrice: parseInt(form.startPrice),
        bidIncrement: parseInt(form.bidIncrement),
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      });
      toast.success('경매가 등록되었습니다');
      router.push('/admin/auctions');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : msg || '등록에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">경매 등록</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">상품 선택</label>
          <select
            required
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
          >
            <option value="">상품을 선택하세요</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.category})
              </option>
            ))}
          </select>
          {products.length === 0 && (
            <p className="text-xs text-gray-400 mt-1">경매 등록 가능한 상품이 없습니다</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">시작가 (원)</label>
            <input
              type="number"
              required
              min={1000}
              value={form.startPrice}
              onChange={(e) => setForm({ ...form, startPrice: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
              placeholder="10000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">입찰 단위 (원)</label>
            <input
              type="number"
              required
              min={100}
              value={form.bidIncrement}
              onChange={(e) => setForm({ ...form, bidIncrement: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
              placeholder="1000"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">시작 시간</label>
            <input
              type="datetime-local"
              required
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">종료 시간</label>
            <input
              type="datetime-local"
              required
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1A1A1A] text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? '등록 중...' : '경매 등록'}
        </button>
      </form>
    </div>
  );
}
