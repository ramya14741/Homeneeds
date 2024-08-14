import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Directbuy } from './directbuy.dto';
import { directBuy } from './directbuy.entity';

@Injectable()
export class DirectbuyService {
    constructor(@Inject('DIRECTBUY_REPOSITORY')
    private directBuyRepository : typeof directBuy){}

    async addDirectBuyProduct(directBuy:Directbuy):Promise<directBuy>{
        try{
            return await this.directBuyRepository.create(directBuy)
        }
        catch(e){
            throw e;
        }
    }

    async getDirectbuyByCustomer(mobileNumberOrEmail):Promise<directBuy>{
        let res;
        try{
             await this.directBuyRepository.findAll({
                where:{
                    [Op.or]:[{Customer_mobileNumber:mobileNumberOrEmail},{Customer_email:mobileNumberOrEmail}]
                }
             })
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

    async deleteDirectbuyByCandP(productid):Promise<any>{
        try{
            return await this.directBuyRepository.destroy({
                where:{
                   // [Op.or]:[{Customer_mobileNumber:mobileNumberOrEmail},{Customer_mobileNumber:mobileNumberOrEmail}]
                    [Op.and]:{productId:productid}
                }
            })
        }
        catch(e){
            throw e;
        }
    }

    async deleteDirectbuyByC(mobileNumberOrEmail):Promise<any>{
        try{
            return await this.directBuyRepository.destroy({
                where:{
                    [Op.or]:[{Customer_mobileNumber:mobileNumberOrEmail},{Customer_email:mobileNumberOrEmail}]
                }
            })
        }
        catch(e){
            throw e;
        }
    }

async updateDirectbuyProduct(mobileNumberOrEmail, idDirectBuy,quantity):Promise<directBuy>{
    let res;
    try{
        await this.directBuyRepository.update({
            quantity:quantity
        },
        {where:{
            [Op.or]:[{Customer_mobileNumber:mobileNumberOrEmail},{Customer_email:mobileNumberOrEmail}],
            [Op.and]:{idDirectBuy:idDirectBuy}
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
}
