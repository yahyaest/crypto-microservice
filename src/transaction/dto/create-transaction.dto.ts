import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  type: 'CRYPTO' | 'STOCK' | 'FOREX';

  @IsString()
  action: 'BUY' | 'SELL';

  @IsString()
  @IsEmail()
  username: string;

  @IsString()
  wallet: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  symbol: string;

  @IsString()
  unit_price: string;

  @IsString()
  value: string;

  @IsInt()
  amount: number;
}
