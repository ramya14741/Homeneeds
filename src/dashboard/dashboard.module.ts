import { Module } from '@nestjs/common';
import { OrderTrackingModule } from '../order-tracking/order-tracking.module';
import { OrderTrackingService } from '../order-tracking/order-tracking.service';
import { AuthModule } from '../auth/auth.module';
import { razorPayProvider } from '../auth/auth.provider';
import { PaymentService } from '../auth/payment';
import { DashboardService } from './dashboard.service';
import { orderTrackingProvider } from '../order-tracking/order-tracking.provider';
import { MulterModule } from '@nestjs/platform-express';
import { categoryProvider } from '../category/category.provider';
import { CategoryService } from '../category/category.service';
import { CategoryModule } from '../category/category.module';
import { adminProvider } from './admin.provider';
import { OfferModule } from '../offer/offer.module';
import { offerProvider } from '../offer/offer.provider';
import { OfferService } from '../offer/offer.service';

@Module({
  imports: [AuthModule,OrderTrackingModule,CategoryModule,OfferModule],
  providers: [...offerProvider,OfferService,...adminProvider,OrderTrackingService,...orderTrackingProvider,PaymentService,DashboardService,...razorPayProvider,...orderTrackingProvider,...categoryProvider,CategoryService]
})
export class DashboardModule {}
