import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBidDto } from './dto/create-bid.dto';

@Injectable()
export class BidsService {
  constructor(private prisma: PrismaService) {}

  async placeBid(auctionId: string, bidderId: string, dto: CreateBidDto) {
    const auction = await this.prisma.auction.findUnique({
      where: { id: auctionId },
      include: { product: true },
    });

    if (!auction) throw new NotFoundException('경매를 찾을 수 없습니다');
    if (auction.status !== 'ACTIVE') {
      throw new BadRequestException('진행 중인 경매에만 입찰할 수 있습니다');
    }
    if (auction.product.sellerId === bidderId) {
      throw new BadRequestException('자신의 상품에는 입찰할 수 없습니다');
    }

    const minBid = auction.currentPrice + auction.bidIncrement;
    if (dto.amount < minBid) {
      throw new BadRequestException(
        `입찰 금액은 ${minBid.toLocaleString()}원 이상이어야 합니다`,
      );
    }

    const [bid] = await this.prisma.$transaction([
      this.prisma.bid.create({
        data: { auctionId, bidderId, amount: dto.amount },
        include: { bidder: { select: { id: true, name: true } } },
      }),
      this.prisma.auction.update({
        where: { id: auctionId },
        data: { currentPrice: dto.amount },
      }),
    ]);

    return bid;
  }

  async getAuctionBids(auctionId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [bids, total] = await Promise.all([
      this.prisma.bid.findMany({
        where: { auctionId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { bidder: { select: { id: true, name: true } } },
      }),
      this.prisma.bid.count({ where: { auctionId } }),
    ]);

    return {
      data: bids,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getMyBids(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [bids, total] = await Promise.all([
      this.prisma.bid.findMany({
        where: { bidderId: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          auction: {
            include: { product: { select: { id: true, title: true, images: true } } },
          },
        },
      }),
      this.prisma.bid.count({ where: { bidderId: userId } }),
    ]);

    return {
      data: bids,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
