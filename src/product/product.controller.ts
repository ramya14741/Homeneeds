import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductAdminDto, ProductDto } from './product.dto';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('product')
@Controller('product')
export class ProductController {
    constructor(private productService: ProductService){}

    @ApiBearerAuth()
@UseGuards(AuthGuard('UandSW'))
@Get('findAllProductsbyPageNo/:pageno')
@ApiParam({
    type:Number,
    name:'pageno',
    required:true
})
async findAllProductsbyPageNo(@Param('pageno')pageno:Number){
    try{
        return await this.productService.findAllProductsbyPageNo(pageno);
    }
    catch(e){
        throw e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('UandSW'))
@Get('findAllProducts')
async findAllProducts(){
    try{
        return await this.productService.findAllProducts();
    }
    catch(e){
        throw e;
    }
}

@Post('saveProduct')
@ApiBody({type:ProductAdminDto, required:true})
async saveProducts(@Body() product){
    try{
        return await this.productService.saveProducts(product)
    }
    catch(e){
        throw e;
    }
}
@Post('findProductbyCategory/:pageno')
@ApiBody({
    type:Array,
   // name:'Category',
    required:true
})
@ApiParam({
    type:Number,
    name:'pageno',
    required:true
})
async findProductByCategory(@Body()Category:[],@Param('pageno')pageno:Number){
    try{
        return await this.productService.findProductByCategory(Category,pageno);
    }
    catch(e){
        throw e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('superAdmin'))
@Post('findProductbybarcode')
@ApiBody({
    type:Array,
    required:true
})
async findProductbybarcode(@Body()sku:[]){
    try{
        return await this.productService.findProductbybarcode(sku);
    }
    catch(e){
        throw e;
    }
}
@ApiBearerAuth()
@UseGuards(AuthGuard('UandSW'))
@Get('findProductById/:id')
@ApiParam({type:Number, name:'id',required:true})
async findProductById(@Param('id') id:number){
try{
    return await this.productService.findProductById(id)
}
catch(e){
    throw e;
}
}
@ApiBearerAuth()
@UseGuards(AuthGuard('User'))
@Get('searchProduct/:text/:pageno')
@ApiParam({type:String, name:'text',required:true})
async searchProduct(@Param('text') text:string,@Param('pageno') pageno:string){
    try{
        return await this.productService.searchProduct(text,pageno);
    }
    catch(e){
        throw e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Put('updateProduct/:productId')
@ApiBody({type:ProductAdminDto,required:true})
@ApiParam({type:Number,name:'productId',required:true})
async updateProduct(@Body() product, @Param('productId')productId:number){
    try{
        return await this.productService.updateProduct(product,productId)
    }
    catch(e){
        throw e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Delete('deleteProductbyId/:productId')
@ApiParam({type:Number, name:'productId',required:true})
async deleteProductbyId(@Param('productId') productId:number){
    try{
        return await this.productService.deleteProductbyId(productId)
    }
    catch(e){
        throw e;
    }

}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Delete('deleteProductByAdmin/:productId')
@ApiParam({type:Number, name:'productId',required:true})
async deleteProductByAdmin(@Param('productId') productId:number){
    try{
        return await this.productService.deleteProductByAdmin(productId);
    }
    catch(e){
        throw e;
    }
}


@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Put('updateProductSku/:productid/:sku')
@ApiParam({type:Number, name:'productid',required:true})
@ApiParam({type:String, name:'sku',required:true})
async updateProductSku(productid, sku){
    try{
        return await this.productService.updateProductSku(productid, sku)
    }
    catch(e){
        throw e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('wAdmin'))
@Get('getTotalProductCount')
async getTotalProductCount(){
try{
    return await this.productService.getTotalProductCount();
}
catch(e){
    throw e;
}
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Get('getTotalProductCountBasedonCategory')
async getTotalProductCountBasedonCategory(){
try{
    return await this.productService.getTotalProductCountBasedonCategory();
}
catch(e){
    throw e;
}
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Get('getProductAddedafterDate/:fromDate')
@ApiParam({type:Date,name:'fromDate',required:true})
async getProductAddedafterDate(@Param('fromDate')fromDate:Date){
try{
    return await this.productService.getProductAddedafterDate(fromDate)
}
catch(e){
    throw e;
}
}
}

