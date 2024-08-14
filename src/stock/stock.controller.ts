import { Controller, Get, Param, HttpException, HttpStatus, Post, Body, Put, UseInterceptors, Req, UploadedFile, RawBodyRequest, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExcludeController, ApiExcludeEndpoint, ApiParam, ApiTags } from '@nestjs/swagger';
import { StockDto } from './stock.dto';
import { StockService } from './stock.service';
import * as dotenv from 'dotenv';
import * as sharp from 'sharp';
import * as crypto from 'crypto'
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from '../dashboard/file-helper';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AuthGuard } from '@nestjs/passport';
dotenv.config();
const region = process.env.region;
const accessKey = process.env.awsAccessKeyId;
const secretAccessKey = process.env.awsSecretAccessKey;
const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
    },
    region: region,

})

export const uploadFile = (filename:string = 'file',stockReq:any =Body):MethodDecorator=>(
    target:any,
    propertykey,
    descriptor:PropertyDescriptor,
)=>{
    ApiBody({
        schema:{
            type:'object',
            properties:{
                [filename]:{
                    type:'string',
                    format:'binary'
                },
                [stockReq]:{
                    type:StockDto,
                    format:Body
                }
            },
        },
    })(target, propertykey, descriptor)
};


@ApiTags('stock')
@Controller('stock')
@ApiExcludeController()
export class StockController {
    constructor(private stockService:StockService){}

    @ApiExcludeEndpoint()
    @ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Get('getStock/:productId')
@ApiParam({type:Number, name:'productId', required:true})
async getStock(@Param('productId') productId:Number){
    try{
        return await this.stockService.getStock(productId);
    }
    catch(e){
        return e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Post('addStock')
@ApiConsumes('multipart/form-data')
@ApiBody({type:StockDto,required:true})
@uploadFile('filename','stockReq')
// @UseInterceptors(FileExtender)
@UseInterceptors(
    FileInterceptor(
        'filename',{
            fileFilter:imageFileFilter,
        }),
        )
async postStock(@Req() req:any,@UploadedFile() file:Express.Multer.File,@Body() stock){
    try{
        const bucketName = process.env.bucketName;
        const randomImageName = (bytes = 32)=>crypto.randomBytes(bytes).toString('hex');
        const buffer = await sharp(req.file.buffer).toBuffer();
        const params ={
            Bucket:bucketName,
            Key:randomImageName(),
            Body:buffer,
            ContentType:req.file.mimetype,
        }
        const addProductImage = new PutObjectCommand(params);
        const addImageRes = await s3.send(addProductImage);
        const getsignedUrlParam ={
            Bucket :params.Bucket,
            Key:params.Key
            //Region:process.env.region
        }
        const s3SignedUrl = new GetObjectCommand(getsignedUrlParam);
       // s3.config.region  process.env.region
        const url = await getSignedUrl(s3, s3SignedUrl);
        const res = await this.stockService.postStock(stock.stockReq,params,url)
        //const addProduct = await this.pro
         return res;
    }
    catch(e){
        return e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Get('getAllStock/:pageno')
@ApiParam({type:Number, name:'pageno',required:true})
async getAllStock(@Param('pageno') pageno:number){
    try{
        return await this.stockService.getAllStock(pageno);
    }
    catch(e){
        return e;
    }
}


@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Get('searchStock/:text/:pageno')
@ApiParam({type:String, name:'text',required:true})
async searchStock(@Param('text') text:string,@Param('pageno') pageno:string){
    try{
        return await this.stockService.searchStock(text,pageno);
    }
    catch(e){
        return e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('UandSW'))
@Put('updateUnits/:productid/:category/:quantity')
@ApiParam({type:Number, name:'productid', required:true})
@ApiParam({type:String, name:'category',required:true})
@ApiParam({type:Number, name:'quantity',required:true})
async updatesUnits(@Param('productid')productid :Number, @Param('category')category:String,
@Param('quantity') quantity:Number){
    try{
        return await this.stockService.updateUnits(productid, category, quantity)
    }
    catch(e){
        return e;
    }
}
@ApiExcludeEndpoint()
@Put('reduceUnits/:productid/:category/:quantity')
@ApiParam({type:Number, name:'productid', required:true})
@ApiParam({type:String, name:'category',required:true})
@ApiParam({type:Number, name:'quantity',required:true})
async reduceUnits(@Param('productid')productid :Number, @Param('category')category:String,
@Param('quantity') quantity:Number){
    try{
        return await this.stockService.reduceUnits(productid, category, quantity)
    }
    catch(e){
        return e;
    }
}
@ApiExcludeEndpoint()
@Put('updateProductId/:stockid/:productid')
@ApiParam({type:Number, name:'stockid',required:true})
@ApiParam({type:Number, name: 'productid',required:true})
async updateProductId(@Param('stockid')stockid:number,@Param('productid')productid:number){
    try{
        return await this.stockService.updateProductId(stockid,productid);
    }
    catch(e){
        return e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Put('updateStockbyWarehouseAdmin/:productid')
@ApiBody({type:StockDto,required:true})
@ApiParam({type:Number, name:'productid',required:true})
async updateStockbyWarehouseAdmin(@Body() stock , @Param('productid')productid:number){
    try{
        return await this.stockService.updateStockbyWarehouseAdmin(stock,productid)
    }
    catch(e){
        return e;
    }
}

@ApiExcludeEndpoint()
@Get('findAllStock')
async findAllStock(){
    try{
        return await this.stockService.findAllStock();
    }
    catch(e){
        return e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Put('deleteStockbyAdmin/:productid')
@ApiParam({type:Number, name:'productid',required:true})
async deleteStockbyAdmin(@Param('productid') productid:number){
    try{
        return await this.stockService.deleteStockbyAdmin(productid)
    }
    catch(e){
        return e;
    }
}

 }
