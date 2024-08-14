import { Module } from '@nestjs/common';
import { DirectbuyController } from './directbuy.controller';
import { directBuyProvider } from './directbuy.provider';
import { DirectbuyService } from './directbuy.service';

@Module({
  controllers: [DirectbuyController],
  providers: [DirectbuyService,...directBuyProvider]
})
export class DirectbuyModule {}
