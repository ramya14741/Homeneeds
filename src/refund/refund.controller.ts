import { Body, Controller, HttpException, Post, HttpStatus, Put, Param, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiParam, ApiTags } from '@nestjs/swagger';
import { RefundService } from './refund.service';
import { refundDTO } from './refund.dto';
import { JSON } from 'sequelize';
import { AuthGuard } from '@nestjs/passport';
//import { Json } from 'sequelize/types/lib/utils';

@ApiTags('refund')
@Controller('refund')
export class RefundController {
    constructor(private refundService:RefundService){}

    @ApiBearerAuth()
@UseGuards(AuthGuard('User'))
@Post('postRefund')
@ApiBody({type:refundDTO,required:true})
async postRefund(@Body() refundData){
    try{
        return await this.refundService.createRefund(refundData)
    }
    catch(e){
        throw e;
    }
}

@ApiExcludeEndpoint()
@Put('updateRefundStatus/:refundId')
//@ApiBody({type:Number,required:true})
@ApiParam({type:Number,name:'refundId', required:true})
@ApiBody({type:Object,required:true})
async updateRefundStatus(@Body() refundData, @Param('refundId') refundId:String){
    try{
        return await this.refundService.updateRefundStatus(refundId,refundData)
    }
    catch(e){
        throw e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandD'))
@Get('getRefundDetails/:fromDate/:toDate')
@ApiParam({type:Date,name:'fromDate',required:true})
@ApiParam({type:Date,name:'toDate',required:true})
async getRefundDetails(@Param('fromDate')fromDate:Date,@Param('toDate')toDate:Date){
try{
    return await this.refundService.getRefundDetails(fromDate,toDate)
}
catch(e){
    throw e;
}
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandD'))
@Get('getRefundDetailsData/:fromDate/:toDate')
@ApiParam({type:Date,name:'fromDate',required:true})
@ApiParam({type:Date,name:'toDate',required:true})
async getRefundDetailsData(@Param('fromDate')fromDate:Date,@Param('toDate')toDate:Date){
try{
    return await this.refundService.getRefundDetailsData(fromDate,toDate)
}
catch(e){
    throw e;
}
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandD'))
@Get('getTotalRefundOrderCount')
async getTotalRefundOrderCount(){
try{
    return await this.refundService.getTotalRefundOrderCount();
}
catch(e){
    throw e;
}
}
}
