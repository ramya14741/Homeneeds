import { Module } from '@nestjs/common';
import { productProvider } from '../product/product.provider';
import { ProductService } from '../product/product.service';
import { productDetailProvider } from '../product-detail/product-detail.provider';
import { ProductDetailService } from '../product-detail/product-detail.service';
import { StockController } from './stock.controller';
import { stockProvider } from './stock.provider';
import { StockService } from './stock.service';
import { imageProvider } from '../image/image.provider';
import { ImageService } from '../image/image.service';
import { ProductFeedbackService } from '../product-feedback/product-feedback.service';
import { productFbProvider } from '../product-feedback/product-feedback.provider';

@Module({
  controllers: [StockController],
  providers: [ProductFeedbackService, ...productFbProvider,ImageService,...imageProvider,ProductService,...productProvider,StockService,ProductDetailService,...productDetailProvider, ...stockProvider]
})
export class StockModule {}
