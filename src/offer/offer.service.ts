import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { offerDto } from './offer.dto';
import { Offer } from './offer.entity';

@Injectable()
export class OfferService {
    constructor(@Inject('OFFER_REPOSITORY')
    private offerRepository:typeof Offer){}
    async addOffer(offer:offerDto):Promise<Offer>{
        try{
            return await this.offerRepository.create(offer);
        }
        catch(e){
            throw e;
        }
    }

    async getOfferbyProductid(offerid):Promise<Offer[]>{
        let res;
        try{
             await this.offerRepository.findAll({
                where:{
                    idOffer:offerid
                }
            }).map(el=>el.get({plain:true}))
            .then(results=>{
                res = results
            })
            return res;
        }
        catch(e){
            throw e;
        }
    }

    async getAllOffers():Promise<Offer[]>{
        let res;
        try{
            await this.offerRepository.findAll()
            .map(el=>el.get({plain:true}))
            .then(results=>{
                res = results;
            })
            return res;
        }
        catch(e){
            throw e;
        }
    }

    async updateOffer(offerid,productid,offer):Promise<Offer>{
        let res;
        try{
            await this.offerRepository.update(
                {
                    productName:offer.productName,
                    offerStartDate:offer.offerStartDate,
                    offerEndDate:offer.offerEndDate,
                    salePrice:offer.salePrice,
                    discountPrice:offer.retailPrice
                },
                {where:{
                    [Op.and]:[{idOffer:offerid}],
                    [Op.and]:[{productId:productid}]
                },returning:true
            }).then(results=>{
                res = results;
            })
            return res;
        }
        catch(e){
            throw e;
        }
    }

    async deleteOfferbyId(offerid):Promise<any>{
        try{
            return await this.offerRepository.destroy({
                where:{
                    idOffer:offerid
                }
            })
        }
        catch(e){
            throw e;
        }
    }

    async deletebyOfferProductid(productid):Promise<any>{
        try{
            return await this.offerRepository.destroy({
                where:{
                    productId:productid
                }
            })
        }
        catch(e){
            throw e;
        }
    }
}
