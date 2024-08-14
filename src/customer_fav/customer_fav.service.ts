import { Inject, Injectable } from '@nestjs/common';
import { customerfav } from './customer-fav.entity';
import { CustomerFavDto } from './customer-fav.dto';
import { Op } from 'sequelize';

@Injectable()
export class CustomerFavService {
    constructor(@Inject('CUSTOMERFAV-REPOSITORY')
    private customerfavRepository:typeof customerfav){}

async postCustomerFav(customerFav:CustomerFavDto):Promise<customerfav>{
    let res;
    try{
        return await this.customerfavRepository.create(customerFav);
    }
     catch(e){
        return e;
     }
}

async getCustomerFavProduct(mobileorEmail):Promise<customerfav[]>{
    try{
        let res;
        await this.customerfavRepository.findAll({
            where:{
                [Op.or]:[{mobileNumber:mobileorEmail},{email:mobileorEmail}],
                [Op.and]:{isFav:'Y'}
            }
        }).map(el=>el.get({plain:true}))
        .then(results=>{
            res = results;
        })
        if(res.length==0){
    return null;
        }
        return res;
    }
    catch(e){
        return e;
    }
    
}

async updateCustomerFavRepository(mobileorEmail,isFav,productId):Promise<customerfav>{
    let res;
    try{
        await this.customerfavRepository.update({
            isFav:isFav
        },
        {where:{
            [Op.or]:[{mobileNumber:mobileorEmail},{email:mobileorEmail}],
            [Op.and]:{productId:productId}
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
