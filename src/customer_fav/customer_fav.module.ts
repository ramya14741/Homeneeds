import { Module } from '@nestjs/common';
import { customerFavProvider } from './customer-fav.provider';
import { CustomerFavController } from './customer_fav.controller';
import { CustomerFavService } from './customer_fav.service';

@Module({
  controllers: [CustomerFavController],
  providers: [CustomerFavService,...customerFavProvider]
})
export class CustomerFavModule {}
