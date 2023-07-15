import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto';
import { TransactionService } from './transaction.service';
import { DataAccessGuard } from 'src/auth/guard';
import { CustomRequest } from 'src/auth/interface/request.interface';

@Controller('api/transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

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
      console.log(`Failed to retrieve transactions: ${error.message}`);
      throw new HttpException('No transactions found', HttpStatus.NOT_FOUND);
    }
  }

  @Post('/user_assets')
  async getUserTransactionss(
    @Body() payload: { email: string; wallet: string },
  ) {
    try {
      const userTransactions =
        await this.transactionService.getUserTransactions(
          payload.email,
          payload.wallet,
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
      console.log(
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
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
