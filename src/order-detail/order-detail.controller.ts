/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OrderDetailService } from './order-detail.service';
import { orderDetailDTO, postOrderDetailDTO, verifyOrderDTO, OrderUpateDTO, orderDetailPOSDTO } from './order-detail.dto';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { refundDTO } from '../refund/refund.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('order-detail')
@Controller('order-detail')
export class OrderDetailController { 
    constructor(private orderDetailService:OrderDetailService){}


    @ApiBearerAuth()
@UseGuards(AuthGuard('User'))
@Post('createOrder')
@ApiBody({type:orderDetailDTO,required:true})
async createOrder(@Body() OrderData){
try{
    return await this.orderDetailService.createOrder(OrderData);
}
catch(e){
    throw e;
}
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('superAdmin'))
@Post('createPOSOrder')
@ApiBody({type:orderDetailPOSDTO,required:true})
async createPOSOrder(@Body() OrderData){
try{
    return await this.orderDetailService.createPOSOrder(OrderData);
}
catch(e){
    throw e;
}
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('superAdmin'))
@Get('getPOSRevenue/:fromDate/:toDate')
@ApiParam({type:Date,name:'fromDate',required:true})
@ApiParam({type:Date,name:'toDate',required:true})
async getPOSRevenue(@Param('fromDate') fromDate:String,@Param('toDate') toDate:String){
    try{
        return await this.orderDetailService.getPOSRevenue(fromDate,toDate);
    }
    catch(e){
        throw e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('superAdmin'))
@Get('getPOSOrders/:fromDate/:toDate')
@ApiParam({type:Date,name:'fromDate',required:true})
@ApiParam({type:Date,name:'toDate',required:true})
async getPOSOrders(@Param('fromDate') fromDate:String,@Param('toDate') toDate:String){
    try{
        return await this.orderDetailService.getPOSOrders(fromDate,toDate);
    }
    catch(e){
        throw e;
    }
}

@ApiBearerAuth()
@UseGuards(AuthGuard('User'))
@Post('orderDetail')
@ApiBody({type:postOrderDetailDTO, required:true})
async orderDetail(@Body() postOrderData){
    try{
        return await this.orderDetailService.postOrderDetail(postOrderData);
    }
    catch(e){
        throw e;
    }
}


@ApiBearerAuth()
@UseGuards(AuthGuard('User'))
@Post('verifyPayment')
@ApiBody({type: verifyOrderDTO, required:true})
async verifyPayment(@Body() orderReq){
    try{
        return await this.orderDetailService.verifyPayment(orderReq);
    }
    catch(e){
        throw e;
    }
}

@ApiBearerAuth()
@UseGuards(AuthGuard('User'))
@Post('refundPaymentNormal')
@ApiBody({type:refundDTO,required:true})
// @ApiParam({type:String,name:'orderId', required:true})
// @ApiParam({type:String, name:'amount',required:true})
async refundPayment(@Body() refundReq){
    try{
        return await this.orderDetailService.refundPaymentNormal(refundReq)
    }
    catch(e){
        throw e;
    }
}


@ApiBearerAuth()
@UseGuards(AuthGuard('User'))
@Get('orderDetail/:orderId')
@ApiParam({type:String, name:'orderId', required:true})
async getOrderDetail(@Param('orderId') orderId:String){
    try{
        return await this.orderDetailService.getOrderDetail(orderId);
    }
    catch(e)
    {
        throw e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandD'))
@Put('updateOrder/:orderId')
@ApiParam({type:String, name:'orderId', required:true})
@ApiBody({type:OrderUpateDTO, required:true})
async updateOrder(
    @Param('orderId') orderId:String,
    @Body() orderReq
){
    try{
        return await this.orderDetailService.orderUpdate(orderId,orderReq);
    }
    catch(e){
        throw e;
    }
}


@ApiBearerAuth()
@UseGuards(AuthGuard('UandSD'))
@Get('getAllOrderBasedOnCustomer/:mobileNumberorEmail')
@ApiParam({type:String, name:'mobileNumberorEmail', required:true})
async getOrdersBasedonCustomer(@Param('mobileNumberorEmail') mobileNumberorEmail:String){
    try{
        return await this.orderDetailService.getOrderBasedOnCustomer(mobileNumberorEmail);
    }
    catch(e){
        throw e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandD'))
@Get('viewOrderWaitingForDelivery')
async getOrderWaitingForDelivery(){
    try{
        return await this.orderDetailService.getOrderWaitingForDelivery();
    }
    catch(e){
        throw e;
    }
}
@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandD'))
@Get('viewAllOrders/:fromDate/:toDate')
@ApiParam({type:Date,name:'fromDate',required:true})
@ApiParam({type:Date,name:'toDate',required:true})
async viewAllOrders(@Param('fromDate') fromDate:String,@Param('toDate') toDate:String){
    try{
        return await this.orderDetailService.viewAllOrders(fromDate,toDate);
    }
    catch(e){
        throw e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandD'))
@Get('viewAllOrdersData/:fromDate/:toDate')
@ApiParam({type:Date,name:'fromDate',required:true})
@ApiParam({type:Date,name:'toDate',required:true})
async viewAllOrdersData(@Param('fromDate') fromDate:String,@Param('toDate') toDate:String){
    try{
        return await this.orderDetailService.viewAllOrdersData(fromDate,toDate);
    }
    catch(e){
        throw e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandD'))
@Get('viewDeliveredOrders/:fromDate/:toDate')
@ApiParam({type:Date,name:'fromDate',required:true})
@ApiParam({type:Date,name:'toDate',required:true})
async viewDeliveredOrders(@Param('fromDate') fromDate:String,@Param('toDate') toDate:String){
    try{
        return await this.orderDetailService.viewDeliveredOrders(fromDate,toDate);
    }
    catch(e){
        throw e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandD'))
@Get('viewDeliveredOrdersData/:fromDate/:toDate')
@ApiParam({type:Date,name:'fromDate',required:true})
@ApiParam({type:Date,name:'toDate',required:true})
async viewDeliveredOrdersData(@Param('fromDate') fromDate:String,@Param('toDate') toDate:String){
    try{
        return await this.orderDetailService.viewDeliveredOrdersData(fromDate,toDate);
    }
    catch(e){
        throw e;
    }
}


@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandD'))
@Get('getDeliveredOrdersCount')
async getDeliveredOrdersCount(){
    try{
        return await this.orderDetailService.getDeliveredOrdersCount();
    }
    catch(e){
        throw e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandD'))
@Get('getTotalOrderCount')
async getTotalOrderCount(){
    try{
        return await this.orderDetailService.getTotalOrderCount();
    }
    catch(e){
        throw e;
    }
}
}
