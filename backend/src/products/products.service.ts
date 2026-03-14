import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 12) {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { seller: { select: { id: true, name: true } }, auction: true },
      }),
      this.prisma.product.count(),
    ]);

    return {
      data: products,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        seller: { select: { id: true, name: true } },
        auction: { include: { bids: { orderBy: { createdAt: 'desc' }, take: 10 } } },
      },
    });
    if (!product) throw new NotFoundException('상품을 찾을 수 없습니다');
    return product;
  }

  async create(dto: CreateProductDto, sellerId: string) {
    return this.prisma.product.create({
      data: { ...dto, images: dto.images ?? [], sellerId },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}
