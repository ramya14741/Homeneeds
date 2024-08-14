import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { Directbuy } from './directbuy.dto';
import { directBuy } from './directbuy.entity';
import { DirectbuyService } from './directbuy.service';

@ApiTags('directbuy')
@Controller('directbuy')
export class DirectbuyController {
    constructor(private directbuyService : DirectbuyService){}

@ApiBearerAuth()
@UseGuards(AuthGuard('User'))
    @Post('addDirectBuyProduct')
    @ApiBody({type:Directbuy,required:true})
    async addDirectBuyProduct(@Body() directBuy){
        try{
            return await this.directbuyService.addDirectBuyProduct(directBuy)
        }
        catch(e){
            throw e;
        }
    }

    @ApiBearerAuth()
@UseGuards(AuthGuard('User'))
    @Get('getDirectbuyByCustomer/:mobileNumberOrEmail')
    @ApiParam({type:String, name:'mobileNumberOrEmail',required:true})
    async getDirectbuyByCustomer(@Param('mobileNumberOrEmail') mobileNumberOrEmail:string){
        try{
            return await this.directbuyService.getDirectbuyByCustomer(mobileNumberOrEmail)
        }
        catch(e){
            throw e;
        }
    }

    @ApiBearerAuth()
@UseGuards(AuthGuard('User'))
    @Delete('deleteDirectbuyByP/:productid')
    @ApiParam({type:Number, name:'productid',required:true})
    async deleteDirectbuyByCandP(
    @Param('productid') productid:string)
    {
        try{
            return await this.directbuyService.deleteDirectbuyByCandP(productid);
        }
        catch(e){
            throw e;
        }
    }

    @ApiBearerAuth()
@UseGuards(AuthGuard('User'))
    @Delete('deleteDirectbuyByC/:mobileorEmail')
    @ApiParam({type:String, name:'mobileorEmail',required:true})
    async deleteDirectbuyByC(
    @Param('mobileorEmail') mobileorEmail:string)
    {
        try{
            return await this.directbuyService.deleteDirectbuyByC(mobileorEmail);
        }
        catch(e){
            throw e;
        }
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('User'))
    @Put('updateDirectbuyProduct/:mobileNumberorEmail/:idDirectBuy/:quantity')
    @ApiParam({type:String,name:'mobileNumberorEmail',required:true})
    @ApiParam({type:Number,name:'idDirectBuy',required:true})
    @ApiParam({type:Number, name:'quantity',required:true})
    async updateDirectbuyProduct(@Param('mobileNumberorEmail')mobileNumberorEmail:string, @Param('idDirectBuy')idDirectBuy:number, 
    @Param('quantity')quantity:number){
        try{
            return await this.directbuyService.updateDirectbuyProduct(mobileNumberorEmail, idDirectBuy,quantity)
        }
        catch(e){
            throw e;
        }


    }

}
