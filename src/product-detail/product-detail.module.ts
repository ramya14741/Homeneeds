import { Module } from '@nestjs/common';
import { ProductDetailController } from './product-detail.controller';
import { productDetailProvider } from './product-detail.provider';
import { ProductDetailService } from './product-detail.service';

@Module({
  controllers: [ProductDetailController],
  providers: [ProductDetailService,...productDetailProvider]
})
export class ProductDetailModule {}
