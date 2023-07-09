import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { CryptoAuthMiddleware } from 'src/auth/middleware/auth.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(CryptoAuthMiddleware).forRoutes('api/coins');
    // consumer.apply(CryptoAuthMiddleware).forRoutes({path:'api/coins',  method: RequestMethod.ALL });
    consumer.apply(CryptoAuthMiddleware).forRoutes(TransactionController);
  }
}
