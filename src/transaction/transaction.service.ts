import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async getTransactions() {
    return await this.prisma.transaction.findMany();
  }

  async getTransactionsWithParams(query: Object) {
    return await this.prisma.transaction.findMany({ where: query });
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
