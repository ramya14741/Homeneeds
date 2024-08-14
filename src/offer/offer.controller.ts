import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiParam, ApiTags } from '@nestjs/swagger';
import { offerDto } from './offer.dto';
import { OfferService } from './offer.service';

@ApiTags('offer')
@Controller('offer')
export class OfferController {
    constructor(private offerService: OfferService) {}

@ApiExcludeEndpoint()
@ApiBearerAuth()
@UseGuards(AuthGuard('UandSW'))
    @Post('addOffer')
    @ApiBody({type:offerDto, required:true })
    async addOffer(@Body() offer){
        try{
            return await this.offerService.addOffer(offer);
        }
        catch(e){
            throw e;
        }
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('UandSW'))
    @Get('getOffer/:offerid')
    @ApiParam({ type: Number, name: 'offerid', required: true })
    async getOfferbyProductid(@Param('offerid') offerid: number) {
        try {
            return await this.offerService.getOfferbyProductid(offerid);
        }
        catch (e) {
            throw e;
        }
    }
    @ApiBearerAuth()
    @UseGuards(AuthGuard('UandSW'))
    @Get('getAllOffers')
    async getAllOffers() {
        try {
            return await this.offerService.getAllOffers()
        }
        catch (e) {
            throw e;
        }
    }
    @ApiExcludeEndpoint()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('UandSW'))
    @Put('updateOffer/:offerid/:productid')
    @ApiParam({ type: Number, name: 'offerid', required: true })
    @ApiParam({ type: Number, name: 'productid', required: true })
    @ApiBody({ type: offerDto, required: true })
    async updateOffer(@Param('offerid') offerid: number,
        @Param('productid') productid: number,
        @Body() offer
    ) {
        try {
            return await this.offerService.updateOffer(offerid, productid, offer)
        }
        catch (e) {
            throw e;
        }
    }
    @ApiExcludeEndpoint()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('UandSW'))
    @Delete('deletebyOfferid/:offerid')
    @ApiParam({type:Number, name:'offerid',required:true})
    async deleteOfferbyId(@Param('offerid') offerid:number){
        try{
            return await this.offerService.deleteOfferbyId(offerid);
        }
        catch(e){
            throw e;
        }
    }

    @ApiExcludeEndpoint()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('UandSW'))
    @Delete('deletebyOfferProductid/:productid')
    @ApiParam({type:Number, name:'productid',required:true})
    async deletebyOfferProductid(@Param('productid') offerid:number){
        try{
            return await this.offerService.deletebyOfferProductid(offerid);
        }
        catch(e){
            throw e;
        }
    }

}
