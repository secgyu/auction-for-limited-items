'use client';

import Link from 'next/link';
import { formatPrice, getTimeRemaining, getStatusLabel, getStatusColor } from '@/lib/format';
import type { Auction } from '@/types';

interface Props {
  auction: Auction;
}

export default function AuctionCard({ auction }: Props) {
  const product = auction.product;
  const imageUrl = product.images?.[0] || '/placeholder.svg';

  return (
    <Link href={`/auctions/${auction.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span
            className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(auction.status)}`}
          >
            {getStatusLabel(auction.status)}
          </span>
        </div>

        <div className="p-4">
          <p className="text-xs text-gray-400 mb-1">{product.category}</p>
          <h3 className="font-medium text-sm mb-2 truncate">{product.title}</h3>

          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs text-gray-400">현재가</p>
              <p className="font-bold text-base">{formatPrice(auction.currentPrice)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">시작가</p>
              <p className="text-sm text-gray-500">{formatPrice(auction.startPrice)}</p>
            </div>
          </div>

          {auction.status === 'ACTIVE' && (
            <p className="text-xs text-green-600 mt-2 font-medium">
              {getTimeRemaining(auction.endTime)}
            </p>
          )}

          {auction._count && (
            <p className="text-xs text-gray-400 mt-1">
              입찰 {auction._count.bids}회
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
