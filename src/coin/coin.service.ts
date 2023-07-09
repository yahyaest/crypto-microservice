import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCoinDto, UpdateCoinDto } from './dto';

@Injectable()
export class CoinService {
  constructor(private readonly prisma: PrismaService) {}

  async getCoins() {
    return await this.prisma.coin.findMany();
  }

  async getCoinsWithParams(query: Object) {
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
