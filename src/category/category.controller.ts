import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiParam, ApiTags } from '@nestjs/swagger';
import { Category } from './category.dto';
import { CategoryService } from './category.service';

@ApiTags('category')
@Controller('category')
export class CategoryController {
    constructor(private categoryService:CategoryService){}

@ApiBearerAuth()
@UseGuards(AuthGuard('UandSW'))
@Get('getCategories')
async getCategories()
{
try{
    return await this.categoryService.getCategories();
}
catch(e){
    throw e;
}
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Post('addCategory')
// @ApiParam({type:String, name:'categoryId',required:true})
// @ApiParam({type:String, name:'categoryName',required:true})
@ApiBody({type:Category,required:true})
async addCategory(@Body() Category){
    try{
        return await this.categoryService.addCategory(Category)
    }
    catch(e){
        throw e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Put('updateCategory/:idCategory')
@ApiBody({type:Category,required:true})
@ApiParam({type:String, name:'idCategory',required:true})
async updateCategory(@Body() category,@Param('idCategory') idCategory:string){
    try{
        return await this.categoryService.updateCategory(category,idCategory)
    }
    catch(e){
        throw e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Delete('deleteCategorybyId/:idCategory')
@ApiParam({type:String, name:'idCategory',required:true})
async deleteCategorybyId(@Param('idCategory') idCategory:string){
    try {
        return await this.categoryService.deleteCategorybyId(idCategory)
    }
    catch(e){
        throw e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Put('DeleteCategorybyAdmin/:idCategory/:imageName')
@ApiParam({type:String, name:'idCategory',required:true})
@ApiParam({type:String, name:'imageName',required:true})
async DeleteCategorybyAdmin(@Param('idCategory') idCategory:string,@Param('imageName') imageName:string){
    try{
        return await this.categoryService.DeleteCategorybyAdmin(idCategory,imageName);
    }
    catch(e){
        throw e;
    }
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Get('getTotalCategoryCount')
async getTotalCategoryCount(){
try{
    return await this.categoryService.getTotalCategoryCount();
}
catch(e){
    throw e;
}
}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('SandW'))
@Get('getCategoryAddedafterDate/:fromDate')
@ApiParam({type:Date,name:'fromDate',required:true})
async getProductAddedafterDate(@Param('fromDate')fromDate:Date){
try{
    return await this.categoryService.getCategoryAddedafterDate(fromDate)
}
catch(e){
    throw e;
}
}
}
