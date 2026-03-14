'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { formatPrice, formatDate, getTimeRemaining, getStatusLabel, getStatusColor } from '@/lib/format';
import type { Auction, Bid, PaginatedResponse } from '@/types';

export default function AuctionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [bidding, setBidding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchAuction = useCallback(async () => {
    try {
      const [auctionRes, bidsRes] = await Promise.all([
        api.get<Auction>(`/auctions/${id}`),
        api.get<PaginatedResponse<Bid>>(`/auctions/${id}/bids`),
      ]);
      setAuction(auctionRes.data);
      setBids(bidsRes.data.data);
    } catch {
      toast.error('경매 정보를 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAuction();
  }, [fetchAuction]);

  const handleBid = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (!auction || !bidAmount) return;

    const amount = parseInt(bidAmount);
    const minBid = auction.currentPrice + auction.bidIncrement;
    if (amount < minBid) {
      toast.error(`최소 ${formatPrice(minBid)} 이상 입찰해야 합니다`);
      return;
    }

    setBidding(true);
    try {
      await api.post(`/auctions/${id}/bids`, { amount });
      toast.success('입찰이 완료되었습니다!');
      setBidAmount('');
      fetchAuction();
    } catch (err: any) {
      toast.error(err.response?.data?.message || '입찰에 실패했습니다');
    } finally {
      setBidding(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="text-center py-20 text-gray-400">
        경매를 찾을 수 없습니다
      </div>
    );
  }

  const product = auction.product;
  const images = product.images.length > 0 ? product.images : ['/placeholder.svg'];
  const minBid = auction.currentPrice + auction.bidIncrement;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 이미지 갤러리 */}
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
            <img
              src={images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                    i === selectedImage ? 'border-gray-900' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 경매 정보 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(auction.status)}`}>
              {getStatusLabel(auction.status)}
            </span>
            <span className="text-sm text-gray-400">{product.category}</span>
          </div>

          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-500 text-sm mb-6">{product.description}</p>

          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">현재가</p>
                <p className="text-2xl font-bold">{formatPrice(auction.currentPrice)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">시작가</p>
                <p className="text-lg text-gray-500">{formatPrice(auction.startPrice)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">입찰 단위</p>
                <p className="text-sm">{formatPrice(auction.bidIncrement)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">총 입찰</p>
                <p className="text-sm">{auction._count?.bids ?? 0}회</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-400 mb-1">시작 시간</p>
                <p className="text-sm">{formatDate(auction.startTime)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">종료 시간</p>
                <p className="text-sm">{formatDate(auction.endTime)}</p>
              </div>
            </div>

            {auction.status === 'ACTIVE' && (
              <p className="text-green-600 font-medium text-sm mt-4">
                {getTimeRemaining(auction.endTime)}
              </p>
            )}
          </div>

          {/* 입찰 섹션 */}
          {auction.status === 'ACTIVE' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
              <h3 className="font-bold mb-3">입찰하기</h3>
              <p className="text-xs text-gray-400 mb-3">
                최소 입찰가: {formatPrice(minBid)}
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`${minBid.toLocaleString()} 이상`}
                  min={minBid}
                  step={auction.bidIncrement}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                />
                <button
                  onClick={handleBid}
                  disabled={bidding}
                  className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {bidding ? '입찰 중...' : '입찰'}
                </button>
              </div>
            </div>
          )}

          {auction.status === 'ENDED' && auction.winner && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-yellow-800 mb-1">낙찰 완료</h3>
              <p className="text-sm text-yellow-700">
                낙찰자: {auction.winner.name} | 낙찰가: {formatPrice(auction.currentPrice)}
              </p>
            </div>
          )}

          {/* 상품 정보 */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-bold mb-3">상품 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">카테고리</span>
                <span>{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">상태</span>
                <span>{product.condition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">판매자</span>
                <span>{product.seller?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 입찰 이력 */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">입찰 이력</h2>
        {bids.length === 0 ? (
          <p className="text-gray-400 text-sm">아직 입찰 내역이 없습니다</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">입찰자</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">입찰 금액</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">입찰 시간</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bids.map((bid, i) => (
                  <tr key={bid.id} className={i === 0 ? 'bg-green-50' : ''}>
                    <td className="px-4 py-3">
                      {bid.bidder.name}
                      {i === 0 && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                          최고가
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatPrice(bid.amount)}
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
    </div>
  );
}
