'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '@/lib/format';
import type { Bid, PaginatedResponse, User } from '@/types';

export default function MyPage() {
  const router = useRouter();
  const { user, isAuthenticated, hydrate } = useAuthStore();
  const [profile, setProfile] = useState<User | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, bidsRes] = await Promise.all([
          api.get<User>('/auth/profile'),
          api.get<PaginatedResponse<Bid>>('/users/me/bids'),
        ]);
        setProfile(profileRes.data);
        setBids(bidsRes.data.data);
      } catch {
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-40 bg-gray-200 rounded-xl" />
        <div className="h-60 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

      {/* 프로필 */}
      {profile && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
          <h2 className="font-bold mb-4">내 정보</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">이름</p>
              <p className="font-medium">{profile.name}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">이메일</p>
              <p className="font-medium">{profile.email}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">연락처</p>
              <p className="font-medium">{profile.phone || '-'}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">가입일</p>
              <p className="font-medium">{formatDate(profile.createdAt)}</p>
            </div>
          </div>
        </div>
      )}

      {/* 입찰 이력 */}
      <h2 className="font-bold text-lg mb-4">입찰 이력</h2>
      {bids.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400">
          <p>아직 입찰 내역이 없습니다</p>
          <Link href="/auctions" className="text-gray-900 font-medium text-sm hover:underline mt-2 inline-block">
            경매 둘러보기 →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">상품</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">입찰 금액</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">경매 상태</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">입찰 시간</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bids.map((bid) => (
                <tr key={bid.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/auctions/${bid.auctionId}`}
                      className="flex items-center gap-3 hover:underline"
                    >
                      {bid.auction?.product?.images?.[0] && (
                        <img
                          src={bid.auction.product.images[0]}
                          alt=""
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <span className="truncate max-w-[200px]">
                        {bid.auction?.product?.title || '상품'}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatPrice(bid.amount)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {bid.auction && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(bid.auction.status)}`}>
                        {getStatusLabel(bid.auction.status)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-400">
                    {formatDate(bid.createdAt)}
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
