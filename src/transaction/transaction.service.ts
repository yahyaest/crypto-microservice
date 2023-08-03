import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto';
import { CoinService } from 'src/coin/coin.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coinService: CoinService,
  ) {}

  async getTransactions() {
    return await this.prisma.transaction.findMany();
  }

  async getTransactionsWithParams(query: Object) {
    const coinImage = query['coinImage'];
    delete query['coinImage'];
    const transactions = await this.prisma.transaction.findMany({
      where: query,
    });
    if (coinImage==='true' ) {
      for (let transaction of transactions) {
        const coin = await this.coinService.getCoinsWithParams({
          name: transaction.name,
          symbol: transaction.symbol,
        });
        transaction['coinImage'] = coin[0].iconUrl;
      }
    }
    return transactions;
  }

  async getTransaction(id: string) {
    return await this.prisma.transaction.findUnique({ where: { id: +id } });
  }

  async getUserTransactions(email: string, wallet: string) {
    return await this.prisma.transaction.findMany({
      where: { username: email, type: 'CRYPTO', wallet },
    });
  }

  async addTransaction(body: CreateTransactionDto) {
    return await this.prisma.transaction.create({ data: body });
  }
}
