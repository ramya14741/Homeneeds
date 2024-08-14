import { Module } from '@nestjs/common';
import { OrderTrackingController } from './order-tracking.controller';
import { orderTrackingProvider } from './order-tracking.provider';
import { OrderTrackingService } from './order-tracking.service';

@Module({
  controllers: [OrderTrackingController],
  providers: [OrderTrackingService,...orderTrackingProvider]
})
export class OrderTrackingModule {}
