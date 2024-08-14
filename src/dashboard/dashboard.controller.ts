import { BadRequestException, Controller, 
    Delete, Get, HttpException, HttpStatus, Param,
     Post, Req, UploadedFile, UseGuards, UseInterceptors,Request, forwardRef, Inject } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExcludeController, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { imageFileFilter } from './file-helper';
import { Express } from 'express';
import * as dotenv from 'dotenv';
import * as sharp from 'sharp';
import * as crypto from 'crypto'
import { AuthGuard } from '@nestjs/passport';
import { SignInDto } from '../sign-in/sign-in.dto';
import { AuthService } from '../auth/auth.service';
dotenv.config();

export const uploadFile = (filename:string = 'file'):MethodDecorator=>(
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
            },
        },
    })(target, propertykey, descriptor)
};


@ApiTags('dashboard')
@Controller('dashboard')
@ApiExcludeController()
export class DashboardController {
    constructor(private dashboardService:DashboardService,
        @Inject(forwardRef(() => AuthService))
    private authService: AuthService,){}
@ApiBearerAuth()
@UseGuards(AuthGuard('superAdmin'))
@Get('getRevenue/:fromDate/:toDate')
@ApiParam({
type:String,
name:'fromDate',
required:true
})
@ApiParam({
    type:String,
    name:'toDate',
    required:true
})
async getRevenue(@Param('fromDate') fromDate:String,@Param('toDate') toDate:String){
    try{
        return await this.dashboardService.getRevenue(fromDate,toDate)
    }
    catch(e){
        throw e;
    }
}
@ApiBearerAuth()
@UseGuards(AuthGuard('SandD'))
@Get('getOrdersBasedonCategory/:fromDate/:toDate')
@ApiParam({type:Date,name:'fromDate',required:true})
@ApiParam({type:Date,name:'toDate',required:true})
async getOrdersBasedonCategory(@Param('fromDate')fromDate:Date,@Param('toDate')toDate:Date){
    try{
        return await this.dashboardService.getOrdersBasedonCategory(fromDate,toDate)
    }
    catch(e){
        throw e;
    }
}
@ApiBearerAuth()
@UseGuards(AuthGuard('SandD'))
@Get('getOrderCountbasedOnStatus/:fromDate/:toDate/:status')
@ApiParam({type:Date,name:'fromDate',required:true})
@ApiParam({type:Date,name:'toDate',required:true})
@ApiParam({type:String,name:'status',required:true})
async getOrderCount(@Param('fromDate') fromDate:Date, @Param('toDate') toDate:Date, @Param('status')status:String){
try{
    return await this.dashboardService.getOrderCount(fromDate, toDate, status)
}
catch(e){
    throw e;
}
}

// @Get('getTotalStockCount')
// async getTotalStockCount(){
// try{
//     return await this.dashboardService.getTotalStockCount()
// }
// catch(e){
//     return new HttpException({
//         message:e.message||e
//     },HttpStatus.BAD_GATEWAY)
// }
// }

// @Post('createInvoice')
// async createInvoice(){
// try{
//     return await this.dashboardService.createInvoice();
// }
// catch(e){
//     return new HttpException({
//         e:e.message||e
//     },HttpStatus.BAD_REQUEST)
// }
// }

@ApiBearerAuth()
@UseGuards(AuthGuard('UandSD'))
@Get('getInvoice/:invoiceid')
@ApiParam({type:String,name:'invoiceid',required:true})
async getInvoice(@Param('invoiceid') invoiceid:string){
try{
    return await this.dashboardService.getInvoice(invoiceid);
}
catch(e){
    throw e;
}
}

@ApiBearerAuth()
@UseGuards(AuthGuard('superAdmin'))
@Get('fetchAllInvoices')
async getAllInvoices(){
    try{
        return await this.dashboardService.getAllInvoices()
    }
    catch(e){
        throw e;
    }
}

@ApiBearerAuth()
@UseGuards(AuthGuard('SandD'))
@Get('getTotalOrderCount/:fromDate/:toDate')
@ApiParam({type:Date,name:'fromDate',required:true})
@ApiParam({type:Date,name:'toDate',required:true})
async getTotalOrderCount(@Param('fromDate') fromDate:Date, @Param('toDate') toDate:Date){
try{
    return await this.dashboardService.getTotalOrderCount(fromDate, toDate)
}
catch(e){
    throw e;
}
}

@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Get('topLessStock/:pageno')
@ApiParam({
    type:Number,
    name:'pageno',
    required:true
})
async topLessStock(@Param('pageno')pageno:Number){
try{
    return await this.dashboardService.topLessStock(pageno)
}
catch(e){
    throw e;
}
}

@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Get('topSellingStock/:pageno')
@ApiParam({
    type:Number,
    name:'pageno',
    required:true
})
async topSellingStock(@Param('pageno')pageno:Number){
try{
    return await this.dashboardService.topSellingStock(pageno)
}
catch(e){
    throw e;
}
}

// @Post('CategoryImageUpload')
// @ApiConsumes('multipart/form-data')
// @uploadFile('filename')
// @UseInterceptors(
//     FileInterceptor(
//         'filename',{
//             fileFilter:imageFileFilter,
//         }),
//         )
// async CategoryImageUpload1(@Req() req:any,@UploadedFile() file:Express.Multer.File){
//     try{
//         //return await this.dashboardService.CategoryImageUpload();
//         if(!file||req.fileValidationError){
//             throw new BadRequestException('invalid file provided,[image files uploaded]');
//         }
//         const buffer = file.buffer;
//         //const stream = getStream(file.buffer); 
//     }
//     catch(e){
//         return new HttpException({
//             message:e.message||e
//         },HttpStatus.BAD_GATEWAY)
//     }
// }

@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Post('addCategoryfromDashboard/:categoryId/:categoryName')
@ApiConsumes('multipart/form-data')
@ApiParam({type:String,name:'categoryId',required:true})
@ApiParam({type:String,name:'categoryName',required:true})
@uploadFile('filename')
@UseInterceptors(
    FileInterceptor(
        'filename',{
            fileFilter:imageFileFilter,
        }),
        )
async addCategoryfromDashboard(@Req() req:any,@UploadedFile() file:Express.Multer.File,@Param('categoryId') categoryId:String,@Param('categoryName') categoryName:String){
//const req = upload.single('image');
//req.file.buffer   
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
    // const command = new PutObjectCommand(params)
    // s3.send(command);
    return await this.dashboardService.addCategoryfromDashboard(params,categoryId,categoryName);  
}
catch(e){
    throw e;
}
}

@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Post('addOfferfromDashboard/:offerId/:offerName')
@ApiConsumes('multipart/form-data')
@ApiParam({type:String,name:'offerId',required:true})
@ApiParam({type:String,name:'offerName',required:true})
@uploadFile('filename')
@UseInterceptors(
    FileInterceptor(
        'filename',{
            fileFilter:imageFileFilter,
        }),
        )
async addOfferfromDashboard(@Req() req:any,@UploadedFile() file:Express.Multer.File,@Param('offerId') offerId:String,@Param('offerName') offerName:String){
//const req = upload.single('image');
//req.file.buffer   
try{
    const bucketName = process.env.offerbucketName;
    const randomImageName = (bytes = 32)=>crypto.randomBytes(bytes).toString('hex');
    const buffer = await sharp(req.file.buffer).toBuffer();
    const params ={
        Bucket:bucketName,
        Key:randomImageName(),
        Body:buffer,
        ContentType:req.file.mimetype,
    }
    // const command = new PutObjectCommand(params)
    // s3.send(command);
    return await this.dashboardService.addOfferfromDashboard(params,offerId,offerName);  
}
catch(e){
    throw e;
}
}

@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Get('getCategorywithImage')
async getCategorywithImage(){
try{
    return await this.dashboardService.getCategorywithImage();
}
catch(e){
    throw e;
}
}

// @ApiBearerAuth()
// @UseGuards(AuthGuard('SandW'))
@Get('getOfferWithImage')
async getOfferWithImage(){
try{
    return await this.dashboardService.getOfferWithImage();
}
catch(e){
    throw e;
}
}

@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Delete('deleteImage/:imageName')
@ApiParam({type:String,name:'imageName',required:true})
async deleteImage(@Param('imageName') imageName:String){
    try{
        return await this.dashboardService.deleteImage(imageName);
    }
    catch(e){
        throw e;
    }
}


@Get('findAdminbyName/:adminName')
@ApiParam({type:String, name:'adminName',required:true})
async findAdminbyName(@Param('adminName')adminName:String){
    try{
        return await this.dashboardService.findAdminbyName(adminName)
    }
    catch(e){
        throw e;
    }
}
}

