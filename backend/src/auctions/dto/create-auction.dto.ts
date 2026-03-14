import { IsString, IsInt, IsDateString, IsOptional, Min } from 'class-validator';

export class CreateAuctionDto {
  @IsString()
  productId: string;

  @IsInt()
  @Min(1000)
  startPrice: number;

  @IsOptional()
  @IsInt()
  @Min(100)
  bidIncrement?: number;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
