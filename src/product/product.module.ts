import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { productProvider } from './product.provider';
import { ImageService } from '../image/image.service';
import { StockService } from '../stock/stock.service';
import { ProductDetailService } from '../product-detail/product-detail.service';
import { imageProvider } from '../image/image.provider';
import { ImageModule } from '../image/image.module';
import { StockModule } from '../stock/stock.module';
import { ProductDetailModule } from '../product-detail/product-detail.module';
import { productDetailProvider } from '../product-detail/product-detail.provider';
import { stockProvider } from '../stock/stock.provider';
import { ProductFeedbackModule } from '../product-feedback/product-feedback.module';
import { productFbProvider } from '../product-feedback/product-feedback.provider';
import { ProductFeedbackService } from '../product-feedback/product-feedback.service';

@Module({
  imports:[ImageModule, StockModule, ProductDetailModule, ProductFeedbackModule],
  controllers: [ProductController],
  providers: [ProductService,...stockProvider,ProductDetailService,ProductService,ProductFeedbackService,...imageProvider,...productDetailProvider,...stockProvider,...productFbProvider,ImageService, StockService,ProductDetailService, ...productProvider]
})
export class ProductModule {}
