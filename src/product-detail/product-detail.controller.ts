import { Body, Controller, Get, Param, Post, HttpException, HttpStatus, Put } from '@nestjs/common';
import { ProductDetailService } from './product-detail.service';
import { ProductDetailDto } from './product-detail.dto';
import { ApiExcludeEndpoint, ApiParam, ApiTags } from '@nestjs/swagger';
import { orderDetailDTO } from '../order-detail/order-detail.dto';

@ApiTags('product-detail')
@Controller('product-detail')
export class ProductDetailController {
    constructor(private productDetailService:ProductDetailService){}

@ApiExcludeEndpoint()
@Post('addProductDetail')
async addProductDetail(@Body() productDetail:ProductDetailDto){
    try{
        return await this.productDetailService.addProductDetail(productDetail);
    }
    catch(e){
        throw e;
    }
}
@Get('getProductDetail/:productid')
@ApiParam({type:Number, name:'productid', required:true})
async getProductDetail(@Param('productid') productid:string)
{
    try{
        return await this.productDetailService.getProductDetail(productid)
    }
    catch(e){
        throw e;
    }
}

@Get('getdiscountProducts')
async getDiscountProducts(){
    try{
        return await this.productDetailService.getDiscountProducts();
    }
    catch(e){
        throw new HttpException({
            message:e.message||e
        },HttpStatus.BAD_GATEWAY)
    }
}

@Get('getAllProductDetail')
async getAllProductDetail(){
    try{
        return await this.productDetailService.getallProductDetail();
    }
    catch(e){
        throw e;
    }
}
@Post('findProducts')
async findProducts(@Body() orderData:orderDetailDTO[]){
    try{
        return await this.productDetailService.findProducts(orderData);
    }
    catch(e){
        throw e;
    }
}

@ApiExcludeEndpoint()
@Put('UpdatebyWarehouseAdmin/:productid/:salePrice/:MRPprice')
@ApiParam({type:Number, name:'productid',required:true})
@ApiParam({type:String, name:'salePrice',required:true})
@ApiParam({type:String, name:'MRPPrice',required:true})
async UpdatebyWarehouseAdmin(@Param('productid') productid:number, @Param('salePrice') salePrice:string, 
@Param('MRPPrice') MRPPrice:string){
    try{
        return await this.productDetailService.UpdatebyWarehouseAdmin(productid,salePrice, MRPPrice)
    }
    catch(e){
        throw e;
    }

}
}
