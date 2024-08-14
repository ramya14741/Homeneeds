//import { OrderServiceService } from './order-detail/order-detail.service';
import { OrderDetailModule } from './order-detail/order-detail.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseProviders } from './database/database.providers';
import { SignUpController } from './sign-up/sign-up.controller';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { SignInController } from './sign-in/sign-in.controller';
import { SignUpService } from './sign-up/sign-up.service';
import { SignUpModule } from './sign-up/sign-up.module';
import { customerProvider } from './sign-up/sign-up.provider';
import { productProvider } from './product/product.provider';
import { AuthModule } from './auth/auth.module';
import { SignInService } from './sign-in/sign-in.service';
import { SignInModule } from './sign-in/sign-in.module';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { cartProvider } from './cart/cart.provider';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { AddressModule } from './address/address.module';
import { addressProvider } from './address/address.provider';
import { ImageModule } from './image/image.module';
import { imageProvider } from './image/image.provider';
import { ProductDetailModule } from './product-detail/product-detail.module';
import { productDetailProvider } from './product-detail/product-detail.provider';
import { StockModule } from './stock/stock.module';
import { stockProvider } from './stock/stock.provider';
import { ProductFeedbackModule } from './product-feedback/product-feedback.module';
import { ProductFeedbackService } from './product-feedback/product-feedback.service';
import { productFbProvider } from './product-feedback/product-feedback.provider';
//import { RazorpayModule } from 'nestjs-razorpay';
//import { RazorpayModule } from 'nestjs-razorpay';
const RazorPayModule = require('nestjs-razorpay')
import { OrderDetailController } from './order-detail/order-detail.controller';
import { OrderDetailService } from './order-detail/order-detail.service';
import { ProductDetailService } from './product-detail/product-detail.service';
import { PaymentService } from './auth/payment';
import { orderDetailProvider } from './order-detail/order-detail.provider';
import { OrderTrackingModule } from './order-tracking/order-tracking.module';
import { OrderTrackingService } from './order-tracking/order-tracking.service';
import { orderTrackingProvider } from './order-tracking/order-tracking.provider';
import { ProductService } from './product/product.service';
import { ImageService } from './image/image.service';
import { StockService } from './stock/stock.service';
import { RazorpayModule } from 'nestjs-razorpay/lib/RazorpayModule';
import { razorPayProvider } from './auth/auth.provider';
import { RefundModule } from './refund/refund.module';
import { RefundService } from './refund/refund.service';
import { refundDetailProvider } from './refund/refund.provider';
import { ReplaceModule } from './replace/replace.module';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from './category/category.module';
import { CategoryService } from './category/category.service';
import { categoryProvider } from './category/category.provider';
import { CustomerFavModule } from './customer_fav/customer_fav.module';
import { CustomerFavService } from './customer_fav/customer_fav.service';
import { customerFavProvider } from './customer_fav/customer-fav.provider';
//import { AdminController } from './admin/admin.controller';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardModule } from './dashboard/dashboard.module';
import { DashboardService } from './dashboard/dashboard.service';
import { OfferController } from './offer/offer.controller';
import { OfferModule } from './offer/offer.module';
import { OfferService } from './offer/offer.service';
import { offerProvider } from './offer/offer.provider';
import { DirectbuyModule } from './directbuy/directbuy.module';
import { ProductController } from './product/product.controller';
import { ProductDetailController } from './product-detail/product-detail.controller';
import { StockController } from './stock/stock.controller';
import { adminProvider } from './dashboard/admin.provider';
import { AddressService } from './address/address.service';


@Module({
  imports: [
    AuthModule,OrderDetailModule, DatabaseModule, ConfigModule.forRoot({ isGlobal: true }), SignUpModule, AuthModule, SignInModule,
    JwtModule.register({
      secret: process.env.secret,
      signOptions: { expiresIn: '90d' },
    }), ProductModule, CartModule, AddressModule, ImageModule, 
    ProductDetailModule, StockModule, ProductFeedbackModule,
    // RazorpayModule.forRoot({
    //   key_id:'rzp_test_8Qo8BKehgDmX8n',
    //   key_secret:'W59sw9pAeJSXjpRg7sOwjMWb'
    // }),
    OrderTrackingModule,
    OrderDetailModule,
    RefundModule,
    ReplaceModule,
    CategoryModule,
    CustomerFavModule,
    DashboardModule,
    OfferModule,
    DirectbuyModule,
  DatabaseModule],
  controllers: [AppController, SignUpController, SignInController, CartController, OrderDetailController, CategoryController, DashboardController, OfferController,ProductController,ProductDetailController,StockController],
  providers: [AddressService,...adminProvider,DashboardService,...categoryProvider,StockService,...stockProvider,...productDetailProvider,ProductDetailService,AuthService,...razorPayProvider,OfferService,...offerProvider,DashboardService,CustomerFavService,CategoryService,...categoryProvider,RefundService, ...refundDetailProvider,ImageService,ProductService,AppService, SignUpService, ...customerProvider, SignInService, AuthService, CartService, ...productProvider, ...cartProvider, ...addressProvider
   ,...customerFavProvider , ...imageProvider,...orderDetailProvider, OrderTrackingService,...orderTrackingProvider,PaymentService, ProductFeedbackService, ...productFbProvider, OrderDetailService,...razorPayProvider],
})
export class AppModule { }
