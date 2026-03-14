'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { formatDate } from '@/lib/format';
import type { Product, PaginatedResponse } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get<PaginatedResponse<Product>>('/products?limit=50');
      setProducts(data.data);
    } catch {
      toast.error('상품 목록을 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('삭제되었습니다');
      fetchProducts();
    } catch {
      toast.error('삭제에 실패했습니다');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">상품 관리</h1>
        <Link
          href="/admin/products/new"
          className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          + 상품 등록
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
                <th className="text-left px-4 py-3 font-medium text-gray-500">상품명</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">카테고리</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">상태</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">등록일</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">경매</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.images[0] && (
                        <img src={product.images[0]} alt="" className="w-10 h-10 rounded object-cover" />
                      )}
                      <span className="truncate max-w-[200px]">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">{product.condition}</td>
                  <td className="px-4 py-3 text-gray-400">{formatDate(product.createdAt)}</td>
                  <td className="px-4 py-3 text-center">
                    {product.auction ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">등록됨</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">미등록</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
