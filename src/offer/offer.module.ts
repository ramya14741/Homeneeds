import { Module } from '@nestjs/common';
import { offerProvider } from './offer.provider';
import { OfferService } from './offer.service';

@Module({
  providers: [OfferService,...offerProvider]
})
export class OfferModule {}
