import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CoinService } from './coin.service';
import { CreateCoinDto, UpdateCoinDto } from './dto';
import { getCoinChartData, getLastestCoinPrice } from 'utils/utils';
import { CustomLogger } from 'src/myLogger';
import { RolesGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decorator';

@UseGuards(RolesGuard)
@Controller('api/coins')
export class CoinController {
  constructor(
    private readonly coinService: CoinService,
    private readonly config: ConfigService,
  ) {}
  private readonly logger = new CustomLogger(CoinController.name);

  @Get('')
  async getCoins(@Query() query: any) {
    try {
      return await this.coinService.getCoinsWithParams(query);
    } catch (error) {
      this.logger.error(`Failed to retrieve coins: ${error.message}`);
      throw new HttpException('No coins found', HttpStatus.NOT_FOUND);
    }
  }

  @Get('/list')
  async getCoinsNameList(){
    try {
      return await this.coinService.getCoinsNameList();
    } catch (error) {
      this.logger.error(`Failed to retrieve coins: ${error.message}`);
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
      this.logger.log(`Successfully getting the coin with id ${id}`);
      this.logger.log(JSON.stringify(coin));
      // get coin from coinranking
      this.logger.log(
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
      this.logger.log(`Latest coin ${coin.name} price is ${remoteCoinPrice}`);
      // patch coin price
      const newCoin = await this.coinService.updateCoin(`${coin.id}`, {
        price: remoteCoinPrice,
      });
      this.logger.log(`Coin ${coin.name} after price update`);
      this.logger.log(JSON.stringify(newCoin));
      return newCoin;
    } catch (error) {
      if (error.response) {
        this.logger.error(
          `Failed to retrieve coin: ${error.response.data.message}`,
        );
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      } else {
        this.logger.error(`Failed to retrieve coin: ${error.message}`);
        throw new HttpException('Coin not found', HttpStatus.NOT_FOUND);
      }
    }
  }

  @Post('')
  async addCoin(@Body() createCoinDto: CreateCoinDto) {
    try {
      return await this.coinService.addCoin(createCoinDto);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('/:id')
  @Roles('ADMIN')
  async updateCoin(
    @Param('id') id: string,
    @Body() updateCoinDto: UpdateCoinDto,
  ) {
    try {
      return await this.coinService.updateCoin(id, updateCoinDto);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/:id/history')
  async getCoinChartData(@Param('id') id: string, @Query() query: any) {
    try {
      const coinrankingApiKey = this.config.get('COIN_RANKING_API_KEY');
      const polygonApiKey = this.config.get('POLYGON_API_KEY');
      const coin = await this.coinService.getCoin(id);
      const chartData = await getCoinChartData(
        coinrankingApiKey,
        polygonApiKey,
        coin,
        query.duration,
      );
      return chartData;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
