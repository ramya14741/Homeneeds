import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { cartProvider } from './cart.provider';
import { CartService } from './cart.service';

@Module({
  controllers: [CartController],
  providers: [CartService,...cartProvider]
})
export class CartModule {}
