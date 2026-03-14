import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [totalUsers, totalProducts, totalAuctions, totalBids, activeAuctions, recentBids] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.product.count(),
        this.prisma.auction.count(),
        this.prisma.bid.count(),
        this.prisma.auction.count({ where: { status: 'ACTIVE' } }),
        this.prisma.bid.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            bidder: { select: { name: true } },
            auction: { include: { product: { select: { title: true } } } },
          },
        }),
      ]);

    return {
      stats: { totalUsers, totalProducts, totalAuctions, totalBids, activeAuctions },
      recentBids,
    };
  }

  async getUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, name: true, phone: true,
          role: true, createdAt: true,
          _count: { select: { bids: true, wonAuctions: true } },
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
