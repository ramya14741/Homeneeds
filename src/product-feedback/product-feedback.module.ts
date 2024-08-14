import { Module } from '@nestjs/common';
import { ProductFeedbackController } from './product-feedback.controller';
import {  productFbProvider } from './product-feedback.provider';
import { ProductFeedbackService } from './product-feedback.service';

@Module({
  controllers: [ProductFeedbackController],
  providers: [ProductFeedbackService ,...productFbProvider]
})
export class ProductFeedbackModule {}
