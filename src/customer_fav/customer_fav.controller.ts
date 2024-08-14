import { Body, Controller, HttpException, Post, HttpStatus, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CustomerFavService } from './customer_fav.service';
import { CustomerFavDto } from './customer-fav.dto';
import { env } from 'process';
import { BADFAMILY } from 'dns';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('customer-fav')
@Controller('customer-fav')
export class CustomerFavController {
    constructor(private customerFavService:CustomerFavService){}

@ApiBearerAuth()
@UseGuards(AuthGuard('User'))
@Post('postCustomerFav')
@ApiBody({type:CustomerFavDto,required:true})
async postCustomerFav(@Body() customerFav){
    try{
        return await this.customerFavService.postCustomerFav(customerFav);
    }
    catch(e){
        throw e;
    }
}
@ApiBearerAuth()
@UseGuards(AuthGuard('User'))
@Get('getCustomerFavProduct/:mobileorEmail')
@ApiParam({name:'mobileorEmail',type:String,required:true})
async getCustomerFavProduct(@Param('mobileorEmail') mobileorEmail:String){
    try{
        return await this.customerFavService.getCustomerFavProduct(mobileorEmail)
    }
    catch(e){
        throw e;
    }
}
@ApiBearerAuth()
@UseGuards(AuthGuard('User'))
@Put('UpdateCustomerFavProduct/:mobileorEmail/:isFav/:productId')
@ApiParam({name:'mobileorEmail', type:String, required:true})
@ApiParam({name:'isFav', type:String, required:true})
@ApiParam({name:'productId',type:Number, required:true})
async updateCustomerFavProduct(@Param('mobileorEmail') mobileorEmail:String, @Param('isFav') isFav:String,@Param('productId') productId:Number){
    try{
        return await this.customerFavService.updateCustomerFavRepository(mobileorEmail,isFav,productId)
    }
    catch(e){
        throw e;
    }
}
}
