import { Module } from '@nestjs/common';
import { orderTrackingProvider } from '../order-tracking/order-tracking.provider';
import { OrderTrackingService } from '../order-tracking/order-tracking.service';
import { PaymentService } from '../auth/payment';
import { DashboardService } from '../dashboard/dashboard.service';
import { categoryProvider } from './category.provider';
import { CategoryService } from './category.service';
import { razorPayProvider } from '../auth/auth.provider';
import { adminProvider } from '../dashboard/admin.provider';
import { OfferService } from '../offer/offer.service';
import { offerProvider } from '../offer/offer.provider';

@Module({
  providers: [...offerProvider, OfferService,...adminProvider,...razorPayProvider,CategoryService,...categoryProvider,DashboardService,PaymentService,OrderTrackingService,...orderTrackingProvider]
})
export class CategoryModule {}
