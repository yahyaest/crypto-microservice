import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCoinDto, UpdateCoinDto } from './dto';

@Injectable()
export class CoinService {
  constructor(private readonly prisma: PrismaService) {}

  async getCoins() {
    return await this.prisma.coin.findMany();
  }

  async getCoinsWithParams(query: any) {
    // handle query data by days
    if (query.days) {
      const now = new Date();
      now.setDate(now.getDate() - query.days);
      query.createdAt = {
        gte: now.toISOString(), // Greater than or equal to query.days  ago
        lte: new Date().toISOString(), // Less than or equal to today
      };
      delete query.days;
    }
    return await this.prisma.coin.findMany({ where: query });
  }

  async getCoin(id: string) {
    return await this.prisma.coin.findUnique({ where: { id: +id } });
  }

  async addCoin(body: CreateCoinDto) {
    return await this.prisma.coin.create({ data: body });
  }

  async updateCoin(id: string, body: UpdateCoinDto) {
    return await this.prisma.coin.update({
      where: { id: +id },
      data: body,
    });
  }
}
