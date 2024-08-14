import { Controller, Get, Param, HttpException, HttpStatus, Post, Body } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProductFeedbackService } from './product-feedback.service';
import { ProductFeedbackDto } from './product-feedback.dto';

@ApiTags('product-feedback')
@Controller('product-feedback')
export class ProductFeedbackController {
    constructor(private productfbservice:ProductFeedbackService){}
@Get('productfeedback/:productid')
@ApiParam({type:Number, name:'productid', required:true})
async getProductFeedback(@Param('productid') productid:Number){
    try{
        return await this.productfbservice.getProductFeedback(productid)
    }
    catch(e){
        throw e;
    }
}

@Post('saveFeedback')
async saveFeedback(@Body() feedback: ProductFeedbackDto){
try{
    return await this.productfbservice.saveFeedback(feedback);
}
catch(e){
    throw e;
}
}

@Get('getAllProductFeedback')
async getAllProductFeedback(){
    try{
        return await this.productfbservice.getAllProductFeedback();
    }
    catch(e){
        throw e;
    }
}
@ApiExcludeEndpoint()
@Get('getFeedbackDetailforDashboard/:fromDate/:toDate')
@ApiParam({type:Date,name:'fromDate',required:true})
@ApiParam({type:Date,name:'toDate',required:true})
async getFeedbackDetailforDashboard(@Param('fromDate') fromDate:Date, @Param('toDate') toDate:Date){
try{
    return await this.productfbservice.getFeedbackDetailforDashboard(fromDate, toDate)
}
catch(e){
    throw e;
}
}
}
