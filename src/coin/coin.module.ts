import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CryptoAuthMiddleware } from 'src/auth/middleware/auth.middleware';
import { CoinService } from './coin.service';
import { CoinController } from './coin.controller';

@Module({
  imports: [JwtModule.register({})],
  providers: [CoinService],
  controllers: [CoinController],
})
export class CoinModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(CryptoAuthMiddleware).forRoutes('api/coins');
    // consumer.apply(CryptoAuthMiddleware).forRoutes({path:'api/coins',  method: RequestMethod.ALL });
    consumer.apply(CryptoAuthMiddleware).forRoutes(CoinController);
  }
}
