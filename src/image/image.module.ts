import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { imageProvider } from './image.provider';
import { ImageService } from './image.service';

@Module({
  controllers: [ImageController],
  providers: [ImageService,...imageProvider]
})
export class ImageModule {}
