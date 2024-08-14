import { Body, Controller, Post, HttpException, HttpCode, HttpStatus, Get, Delete, Param, Put, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { cartDto } from './cart.dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('cart')
@Controller('cart')
export class CartController {
    constructor(private cartService:CartService){}


    @ApiBearerAuth()
@UseGuards(AuthGuard('User'))
    @Post('addCart')
    @ApiBody({type:cartDto,required:true})
    async addCart(@Body() cart){
        try{
            return await this.cartService.addCart(cart);
        }
        catch(e)
        {
            throw e;
        }
    }

    @ApiBearerAuth()
@UseGuards(AuthGuard('User'))
    @Get('getCartByCustomer/:mobileNumberorEmail')
@ApiParam({type:String, name:'mobileNumberorEmail',required:true})
async getCartByCustomer(@Param('mobileNumberorEmail') mobileNumberorEmail:string){
try{
    return await this.cartService.getCartByCustomer(mobileNumberorEmail)
}
catch(e){
    throw e;
}
}

@ApiBearerAuth()
@UseGuards(AuthGuard('User'))
    @Delete('deleteProductByCustomer/:mobileNumberorEmail/:productId')
    @ApiParam({type:String, name:'mobileNumberorEmail', required:true})
    @ApiParam({type:Number, name:'productId', required:true})
    async deleteProductByCustomer(@Param('mobileNumberorEmail') mobileNumberorEmail:string,@Param('productId') productId:string){
        try{
            return await this.cartService.deleteProductByCustomer(mobileNumberorEmail,productId)
        }
        catch(e)
        {
            throw e;
        }
    }

    @ApiBearerAuth()
@UseGuards(AuthGuard('User'))
    @Delete('deleteCartbyCustomer/:mobileNumberorEmail')
    @ApiParam({type:String, name:'mobileNumberorEmail', required:true})
    async deleteCartbyCustomer(@Param('mobileNumberorEmail') mobileNumberorEmail:string)
    {
        try{
            return await this.cartService.deleteCartbyCustomer(mobileNumberorEmail)
        }
        catch(e){
            throw e;
        }
    }

    @ApiBearerAuth()
@UseGuards(AuthGuard('User'))
    @Put('updateCart/:mobileNumberorEmail/:idCustomerCart/:quantity')
    @ApiParam({type:String, name:'mobileNumberorEmail',required:true})
    @ApiParam({type:Number, name:'idCustomerCart', required:true})
    @ApiParam({type:Number, name:'quantity', required:true})
    async updateCart(@Param('mobileNumberorEmail') mobileNumberorEmail:string,
    @Param('idCustomerCart') idCustomerCart:Number,
    @Param('quantity') quantity:Number){
        try{
            return await this.cartService.updateCart(mobileNumberorEmail,idCustomerCart, quantity)
        }
        catch(e){
            throw e;
        }
    }
}
