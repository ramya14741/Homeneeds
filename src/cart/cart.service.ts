import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { cartDto } from './cart.dto';
import { Cart } from './cart.entity';
import { cartProvider } from './cart.provider';

@Injectable()
export class CartService {
    constructor(@Inject('CART_REPOSITORY') 
    private cartRepository: typeof Cart
    ){}
    async addCart(cart:cartDto):Promise<Cart>{
        try{
            return await this.cartRepository.create(cart);
        }
        catch(e){
            throw e;
        }
    }

    async getCartByCustomer(mobileNumberorEmail):Promise<Cart[]>{
        let res;
        try{
            await this.cartRepository.findAll({
                where:{
                    [Op.or]:[{Customer_mobileNumber:mobileNumberorEmail},{Customer_email:mobileNumberorEmail}]
                }
            })
            .map(el=>el.get({plain:true}))
            .then(results=>{
                res = results
            })
            return res;
        }
        catch(e){
            throw e;
        }
    }

    async deleteProductByCustomer(mobileNumberorEmail,productId):Promise<any>{
        let res;
        try{
            return await this.cartRepository.destroy({
                where:{
                    [Op.or]:[{Customer_mobileNumber:mobileNumberorEmail},{Customer_email:mobileNumberorEmail}],
                    [Op.and]:{productId:productId}
                }
                //paranoid:true
            })
        }
        catch(e){
            throw e;
        }
    }

    async deleteCartbyCustomer(mobileNumberorEmail):Promise<any>{
        let res;
        try{
            return await this.cartRepository.destroy({
                where:{
                    [Op.or]:[{Customer_mobileNumber:mobileNumberorEmail},{Customer_email:mobileNumberorEmail}]
                }
            })
        }
        catch(e){
            throw e;
        }
    }

    async updateCart(mobileNumberorEmail, idCustomerCart, quantity):Promise<Cart>{
       let res;
       try{
           await this.cartRepository.update({
               quantity:quantity
           },
           {where:{
               [Op.or]:[{Customer_mobileNumber:mobileNumberorEmail},{Customer_email:mobileNumberorEmail}],
               [Op.and]:{idCustomerCart:idCustomerCart}
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
