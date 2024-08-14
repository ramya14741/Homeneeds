import { Body, Controller, Post, HttpException, HttpStatus, Put, Param, Get, UseGuards, Header, Headers } from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiHeader, ApiHeaders, ApiParam, ApiTags } from '@nestjs/swagger';
import { ReplaceService } from './replace.service';
import { replaceDTO } from './replace.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('replace')
@Controller('replace')
export class ReplaceController {
    constructor(private replaceService:ReplaceService){}

@ApiBearerAuth()
@UseGuards(AuthGuard('User'))
@Post('createReplace')
@ApiBody({type:replaceDTO,required:true})
async createReplace(@Body() replaceData){
    try{
        return await this.replaceService.createReplace(replaceData)
    }
    catch(e){
        return e;
    }
}
@ApiExcludeEndpoint()
@Put('updateReplaceStatus/:replaceId/:replaceStatus')
@ApiParam({type:Number, name:'replaceId',required:true})
@ApiParam({type:String, name:'replaceStatus',required:true})
async updateReplaceStatus(@Param('replaceId')replaceId, @Param('replaceStatus')replaceStatus){
    try{
        return await this.replaceService.updateReplaceStatus(replaceId, replaceStatus)
    }
    catch(e){
        return e;
    }
}

@ApiBearerAuth()
@UseGuards(AuthGuard('UandSD'))
@Get('replaceDetails')
async getReplaceDetails(){
    try{
        return await this.replaceService.getReplaceDetails();
    }
    catch(e){
        return e;
    }
}


//@ApiHeader({ name: 'authorization', description: 'authorization' })
@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandD'))
//@ApiHeader({name:'authorization'})
@Get('getReplacedProducts/:fromDate/:toDate')
@ApiParam({type:Date,name:'fromDate',required:true})
@ApiParam({type:Date,name:'toDate',required:true})
//@ApiHeaders({ name: 'authorization', description: 'authorization' })
//
async getReplacedProducts(@Param('fromDate')fromDate:Date,@Param('toDate')toDate:Date){
try{
    return await this.replaceService.getReplacedProducts(fromDate,toDate)
}
catch(e){
    throw e;
}
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandD'))
//@ApiHeader({name:'authorization'})
@Get('getReplacedProductsData/:fromDate/:toDate')
@ApiParam({type:Date,name:'fromDate',required:true})
@ApiParam({type:Date,name:'toDate',required:true})
//@ApiHeaders({ name: 'authorization', description: 'authorization' })
//
async getReplacedProductsData(@Param('fromDate')fromDate:Date,@Param('toDate')toDate:Date){
try{
    return await this.replaceService.getReplacedProductsData(fromDate,toDate)
}
catch(e){
    throw e;
}
}
@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandD'))
@Get('getTotalReplaceOrderCount')
async getTotalReplaceOrderCount(){
try{
    return await this.replaceService.getTotalReplaceOrderCount()
}
catch(e){
    throw e;
}
}
}
