import { Module } from '@nestjs/common';
import { ReplaceController } from './replace.controller';
import { replaceDetailsProvider } from './replace.provider';
import { ReplaceService } from './replace.service';

@Module({
  controllers: [ReplaceController],
  providers: [ReplaceService,...replaceDetailsProvider]
})
export class ReplaceModule {}
