import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';

@Injectable()
export class AuctionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string, page = 1, limit = 12) {
    const skip = (page - 1) * limit;
    const where = status ? { status: status as any } : {};

    const [auctions, total] = await Promise.all([
      this.prisma.auction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { include: { seller: { select: { id: true, name: true } } } },
          _count: { select: { bids: true } },
        },
      }),
      this.prisma.auction.count({ where }),
    ]);

    return {
      data: auctions,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const auction = await this.prisma.auction.findUnique({
      where: { id },
      include: {
        product: { include: { seller: { select: { id: true, name: true } } } },
        bids: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: { bidder: { select: { id: true, name: true } } },
        },
        winner: { select: { id: true, name: true } },
        _count: { select: { bids: true } },
      },
    });
    if (!auction) throw new NotFoundException('경매를 찾을 수 없습니다');
    return auction;
  }

  async create(dto: CreateAuctionDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      include: { auction: true },
    });
    if (!product) throw new NotFoundException('상품을 찾을 수 없습니다');
    if (product.auction) throw new BadRequestException('이미 경매가 등록된 상품입니다');

    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);
    if (endTime <= startTime) {
      throw new BadRequestException('종료 시간은 시작 시간 이후여야 합니다');
    }

    const now = new Date();
    const status = startTime <= now ? 'ACTIVE' : 'SCHEDULED';

    return this.prisma.auction.create({
      data: {
        productId: dto.productId,
        startPrice: dto.startPrice,
        currentPrice: dto.startPrice,
        bidIncrement: dto.bidIncrement ?? 1000,
        startTime,
        endTime,
        status,
      },
      include: { product: true },
    });
  }

  async update(id: string, dto: UpdateAuctionDto) {
    await this.findOne(id);
    return this.prisma.auction.update({
      where: { id },
      data: {
        ...dto,
        startTime: dto.startTime ? new Date(dto.startTime) : undefined,
        endTime: dto.endTime ? new Date(dto.endTime) : undefined,
      },
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleAuctionStatusTransitions() {
    const now = new Date();

    await this.prisma.auction.updateMany({
      where: { status: 'SCHEDULED', startTime: { lte: now } },
      data: { status: 'ACTIVE' },
    });

    const endedAuctions = await this.prisma.auction.findMany({
      where: { status: 'ACTIVE', endTime: { lte: now } },
      include: { bids: { orderBy: { amount: 'desc' }, take: 1 } },
    });

    for (const auction of endedAuctions) {
      const winnerId = auction.bids[0]?.bidderId ?? null;
      await this.prisma.auction.update({
        where: { id: auction.id },
        data: { status: 'ENDED', winnerId },
      });
    }
  }
}
