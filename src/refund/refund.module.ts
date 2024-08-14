import { Module } from '@nestjs/common';
import { RefundController } from './refund.controller';
import { refundDetailProvider } from './refund.provider';
import { RefundService } from './refund.service';

@Module({
  controllers: [RefundController],
  providers: [RefundService,...refundDetailProvider]
})
export class RefundModule {}
