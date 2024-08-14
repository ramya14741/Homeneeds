import { Controller, Get, Param, HttpException, HttpStatus, Post, Body, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiParam, ApiTags } from '@nestjs/swagger';
import { OrderTrackingService } from './order-tracking.service';
import { OrderTrackingDTO } from './order-tracking.dto';
import { BeforeFindAfterExpandIncludeAll } from 'sequelize-typescript';
import { identity } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('order-tracking')
@Controller('order-tracking')
export class OrderTrackingController {
    constructor(private orderTrackingService:OrderTrackingService){}
    @ApiBearerAuth()
    @UseGuards(AuthGuard('UandSD'))
    @Get('TrackOrder/:id')
    @ApiParam({type:String, name:'id', required:true})
    async trackorder(@Param('id') id:string){
        try{
            return await this.orderTrackingService.trackorder(id);
        }
        catch(e){
            throw e;
        }
    }

    @ApiExcludeEndpoint()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('UandSD'))
    @Post('orderTracking')
    @ApiBody({type:OrderTrackingDTO, required:true})
    async postOrderTracking(@Body() orderTrackData){
        try{
            await this.orderTrackingService.postOrderTracking(orderTrackData);
        }
        catch(e){
            throw e;
        }
    }

    @ApiExcludeEndpoint()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('UandSD'))
    @Put('updateOrderStatus/:id/:deliveryStatus')
    @ApiParam({type:String, name:'id', required:true})
    @ApiParam({type:String, name:'deliveryStatus', required:true})
    async updateOrderStatus(@Param('id')id,@Param('deliveryStatus')deliveryStatus){
        try{
            await this.orderTrackingService.updateOrderStatus(id, deliveryStatus)
        }
        catch(e){
            throw e;
        }
    }

    @ApiExcludeEndpoint()
    @ApiBearerAuth()
@UseGuards(AuthGuard('SandD'))
    @Get('OrderDetailDashboard/:fromDate/:toDate')
@ApiParam({type:Date,name:'fromDate',required:true})
@ApiParam({type:Date,name:'toDate',required:true})
async OrderDetailDashboard(@Param('fromDate') fromDate:Date, @Param('toDate') toDate:Date){
try{
    return await this.orderTrackingService.OrderDetailDashboard(fromDate, toDate)
}
catch(e){
    throw e;
}
}
}
