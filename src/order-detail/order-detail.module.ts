import { OrderDetailController } from './order-detail.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { OrderDetailService } from './order-detail.service';
import { ProductDetailModule } from '../product-detail/product-detail.module';
import { ProductDetailService } from '../product-detail/product-detail.service';
import { productDetailProvider } from '../product-detail/product-detail.provider';
import { PaymentService } from '../auth/payment';
import { orderDetailProvider } from './order-detail.provider';
import { OrderTrackingService } from '../order-tracking/order-tracking.service';
import { orderTrackingProvider } from '../order-tracking/order-tracking.provider';
import { ProductModule } from '../product/product.module';
import { ProductService } from '../product/product.service';
import { productProvider } from '../product/product.provider';
import { ImageService } from '../image/image.service';
import { imageProvider } from '../image/image.provider';
import { ProductFeedback } from '../product-feedback/product-feedback.entity';
import { productFbProvider } from '../product-feedback/product-feedback.provider';
import { ProductFeedbackService } from '../product-feedback/product-feedback.service';
import { StockService } from '../stock/stock.service';
import { stockProvider } from '../stock/stock.provider';
import { razorPayProvider } from '../auth/auth.provider';
import { RefundService } from '../refund/refund.service';
import { refundDetailProvider } from '../refund/refund.provider';
import { AddressService } from '../address/address.service';
import { SignInService } from '../sign-in/sign-in.service';
import { addressProvider } from '../address/address.provider';
import { customerProvider } from '../sign-up/sign-up.provider';

@Module({
    imports: [ProductDetailModule],
    controllers: [
        OrderDetailController,],
    providers: [...customerProvider,SignInService,AddressService,...addressProvider,RefundService,...refundDetailProvider,StockService,...stockProvider,ProductFeedbackService,...productFbProvider,ImageService,...imageProvider,ProductService,...productProvider,OrderDetailService,ProductDetailService,...productDetailProvider,...orderTrackingProvider,OrderTrackingService,PaymentService,...orderDetailProvider,...razorPayProvider],
})
export class OrderDetailModule { }
