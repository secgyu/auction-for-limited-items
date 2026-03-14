import {
  Controller, Post, Get, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller()
export class BidsController {
  constructor(private bidsService: BidsService) {}

  @Post('auctions/:auctionId/bids')
  @UseGuards(AuthGuard('jwt'))
  placeBid(
    @Param('auctionId') auctionId: string,
    @Body() dto: CreateBidDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.bidsService.placeBid(auctionId, userId, dto);
  }

  @Get('auctions/:auctionId/bids')
  getAuctionBids(
    @Param('auctionId') auctionId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.bidsService.getAuctionBids(
      auctionId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get('users/me/bids')
  @UseGuards(AuthGuard('jwt'))
  getMyBids(
    @CurrentUser('id') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.bidsService.getMyBids(
      userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }
}
