import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto';
import { TransactionService } from './transaction.service';
import { DataAccessGuard } from 'src/auth/guard';
import { CustomRequest } from 'src/auth/interface/request.interface';
import { CustomLogger } from 'src/myLogger';
import { TransactionType } from '@prisma/client';

@Controller('api/transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  private readonly logger = new CustomLogger(TransactionController.name);

  @Get('')
  @UseGuards(DataAccessGuard)
  async getTransactions(@Query() query: any, @Req() req: CustomRequest) {
    try {
      const user = req.user;
      if (user.role !== 'ADMIN') {
        query.username = user.email;
      }
      return await this.transactionService.getTransactionsWithParams(query);
    } catch (error) {
      this.logger.error(`Failed to retrieve transactions: ${error.message}`);
      throw new HttpException('No transactions found', HttpStatus.NOT_FOUND);
    }
  }

  @Get('/:id')
  @UseGuards(DataAccessGuard)
  async getTransaction(@Param('id') id: string, @Req() req: CustomRequest) {
    try {
      const user = req.user;
      const transaction = await this.transactionService.getTransaction(id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      if (user.email !== transaction.username && user.role !== 'ADMIN') {
        throw new Error('Transaction belong to another user');
      }
      return transaction;
    } catch (error) {
      this.logger.error(`Failed to retrieve transaction: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post('/user_assets')
  async getUserTransactionsAssets(
    @Body() payload: { email: string; wallet: string; type: TransactionType },
  ) {
    try {
      const userTransactions =
        await this.transactionService.getUserWalletTransactions(
          payload.email,
          payload.wallet,
          payload.type,
        );
      let userAssets: { name: string; symbol: string }[] = [];
      for (let transaction of userTransactions) {
        const checkAsset = userAssets.filter(
          (asset) => asset.name === transaction.name,
        );
        if (checkAsset.length === 0) {
          userAssets.push({
            name: transaction.name,
            symbol: transaction.symbol,
          });
        }
      }
      return userAssets;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve transactions for user with email ${payload.email} and wallet ${payload.wallet}. \n ERROR: ${error.message}`,
      );
      throw new HttpException(
        `No transactions found for user with email ${payload.email} and wallet ${payload.wallet}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('')
  async addTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    try {
      return await this.transactionService.addTransaction(createTransactionDto);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('/:id')
  @UseGuards(DataAccessGuard)
  async deleteTransaction(@Param('id') id: string, @Req() req: CustomRequest) {
    try {
      const user = req.user;
      const transaction = await this.transactionService.getTransaction(id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      if (user.email !== transaction.username && user.role !== 'ADMIN') {
        throw new Error('Transaction belong to another user');
      }
      await this.transactionService.removeTransaction(id);
      return transaction;
    } catch (error) {
      this.logger.error(`Failed to retrieve transaction: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
