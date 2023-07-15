import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CoinService } from './coin.service';
import { CreateCoinDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { getLastestCoinPrice } from 'utils/utils';

@Controller('api/coins')
export class CoinController {
  constructor(
    private readonly coinService: CoinService,
    private readonly config: ConfigService,
  ) {}

  @Get('')

  async getCoins(@Query() query: any) {
    try {
      return await this.coinService.getCoinsWithParams(query);
    } catch (error) {
      console.log(`Failed to retrieve coins: ${error.message}`);
      throw new HttpException('No coins found', HttpStatus.NOT_FOUND);
    }
  }

  @Get('/:id')
  async getCoin(@Param('id') id: string) {
    try {
      // get coin from crypto microservice
      let coin = await this.coinService.getCoin(id);
      if (!coin) {
        throw new Error('Coin not found');
      }
      console.log(`Successfully getting the coin with id ${id}`);
      console.log(coin);
      // get coin from coinranking
      console.log(
        `Getting coin ${coin.name} from coinranking and patching its price`,
      );
      // const options = {
      //   headers: {
      //     'x-access-token': this.config.get('COIN_RANKING_API_KEY'),
      //   },
      // };
      // const response = await axios.get(
      //   `https://api.coinranking.com/v2/coins?symbols=${coin.symbol}&search=${coin.name}`,
      //   options,
      // );
      // const remoteCoin = response.data.data.coins[0];
      const apiKey = this.config.get('COIN_RANKING_API_KEY');
      const remoteCoinPrice = await getLastestCoinPrice(apiKey, coin);
      console.log(`Latest coin ${coin.name} price is ${remoteCoinPrice}`);
      // patch coin price
      const newCoin = await this.coinService.updateCoin(`${coin.id}`, {
        price: remoteCoinPrice,
      });
      console.log(`Coin ${coin.name} after price update`);
      console.log(newCoin);
      return newCoin;
    } catch (error) {
      if (error.response) {
        console.log(`Failed to retrieve coin: ${error.response.data.message}`);
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      } else {
        console.log(`Failed to retrieve coin: ${error.message}`);
        throw new HttpException('Coin not found', HttpStatus.NOT_FOUND);
      }
    }
  }

  @Post('')
  async addCoin(@Body() createCoinDto: CreateCoinDto) {
    try {
      return await this.coinService.addCoin(createCoinDto);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
