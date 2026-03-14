import { IsInt, IsDateString, IsOptional, IsEnum, Min } from 'class-validator';

enum AuctionStatus {
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED',
}

export class UpdateAuctionDto {
  @IsOptional()
  @IsInt()
  @Min(1000)
  startPrice?: number;

  @IsOptional()
  @IsInt()
  @Min(100)
  bidIncrement?: number;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsEnum(AuctionStatus)
  status?: AuctionStatus;
}
