import { IsInt, IsJSON, IsOptional, IsString } from 'class-validator';

export class CreateCoinDto {
  @IsString()
  symbol: string;

  @IsString()
  name: string;

  @IsString()
  price: string;

  @IsInt()
  @IsOptional()
  rank: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  iconUrl: string;

  @IsString()
  @IsOptional()
  websiteUrl: string;

  @IsString()
  @IsOptional()
  coinrankingUrl: string;

  @IsString()
  @IsOptional()
  marketCap: string;

  @IsString()
  @IsOptional()
  lastDayVolume: string;

  @IsInt()
  @IsOptional()
  numberOfMarkets: number;

  @IsInt()
  @IsOptional()
  numberOfExchanges: number;

  @IsJSON()
  @IsOptional()
  allTimeHigh: { price: string; timestamp: number };
}
