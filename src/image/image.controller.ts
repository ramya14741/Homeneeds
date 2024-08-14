import { Body, Controller, Post, HttpException, HttpStatus, Get, Param } from '@nestjs/common';
import { ImageService } from './image.service';
import { imageDto } from './image.dto';
import { ApiExcludeEndpoint, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('image')
@Controller('image')
export class ImageController {
    constructor(private imageService:ImageService){}

@ApiExcludeEndpoint()
@Post('addImage')
async addImage(@Body() image:imageDto){
    try{
        return await this.imageService.addImage(image);
    }
    catch(e){
        throw e;
    }
}
@Get('getProductImage/:productid')
@ApiParam({type:Number, name:'productid', required:true})
async getProductImage(@Param('productid') productid:Number){
    try{
        return await this.imageService.getProductImages(productid)
    }
    catch(e){
        throw e;
    }
}
@Get('getAllImages')
async getAllImages(){
    try{
        return await this.imageService.getAllImages();
    }
    catch(e){
        throw e;
    }
}
}
