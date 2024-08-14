import { Controller, Get, Param, HttpException, HttpStatus, Body, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { AddressDto } from './address.dto';
import { AddressService } from './address.service';

@ApiTags('address')
@Controller('address')
export class AddressController {
    constructor(private addressService:AddressService){}

@ApiBearerAuth()
@UseGuards(AuthGuard('User'))
@Get('getAddress/:mobileorEmail')
@ApiParam({
    name:'mobileorEmail',
    type:String,
    required:true
})
async getAddress(@Param('mobileorEmail') mobileorEmail:String){
try{
    return await this.addressService.getAddress(mobileorEmail);
}
catch(e){
    throw e;
}
}

@ApiBearerAuth()
@UseGuards(AuthGuard('User'))
@Get('getAddressbyId/:id')
@ApiParam({
    name:'id',
    type:Number,
    required:true
})
async getAddressbyId(@Param('id') id:Number){
try{
    return await this.addressService.getAddress(id);
}
catch(e){
    throw e;
}
}
@ApiBearerAuth()
@UseGuards(AuthGuard('User'))
@Post('addAddress')
@ApiBody({type:AddressDto, required:true})
async addAddress(@Body() address){
    try{
        return await this.addressService.addAddress(address);
    }
    catch(e){
        throw e;
    }
}
@ApiBearerAuth()
@UseGuards(AuthGuard('User'))
@Put('updateAddress/:idAddress')
@ApiParam({type:Number, name:'idAddress', required:true})
@ApiBody({type:AddressDto,required:true})
async updateAddress(@Body() address,@Param('idAddress') idAddress:number){
    try{
        return await this.addressService.updateAddress(address, idAddress)
    }
    catch(e)
    {
        throw e;
    }
}
@ApiBearerAuth()
@UseGuards(AuthGuard('User'))
@Delete('deleteAddressbyId/:idAddress')
@ApiParam({type:Number, name:'idAddress', required:true})
async deleteAddress(@Param('idAddress') idAddress:number){
    try{
        return await this.addressService.deleteAddress(idAddress)
    }
    catch(e){
        throw e;
    }
}
}

