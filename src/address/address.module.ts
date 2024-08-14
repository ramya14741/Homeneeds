import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { addressProvider } from './address.provider';

@Module({
  controllers: [AddressController],
  providers: [AddressService,...addressProvider]
})
export class AddressModule {}
