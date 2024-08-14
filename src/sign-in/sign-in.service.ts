import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
//import Op from 'sequelize/types/lib/operators';
import { Customer } from 'src/sign-up/sign-up.entity';
import { customerProvider } from '../sign-up/sign-up.provider';
import { SignInDto } from './sign-in.dto';

@Injectable()
export class SignInService {
    constructor(@Inject('CUSTOMER_REPOSITORY')
    private customerRepository : typeof Customer){}

    async findUser(mobileOrEmail):Promise<Customer>{
        try{
            let res;
             await this.customerRepository.findAll({
                where: {
                    [Op.or]: [{mobileNumber: mobileOrEmail}, {email: mobileOrEmail}]
                }
            }).map(el => el.get({ plain: true }))
            .then(results=>{
              res = results;
            
            })
            if(res.length ==0){
                return null;
            }
            return res;
        }
        catch(e){
            console.log('findUsererror',e);
            throw e
        }
    }

    async findAdmin(mobileOrEmail):Promise<Customer>{
        try{
            let res;
            await this.customerRepository.findAll({
                where:{
                    [Op.or]:[{mobileNumber:mobileOrEmail},{email:mobileOrEmail}],
                   CustomerType:['A','D']
                }
            }).map(el=>el.get({plain:true}))
            .then(results=>{
                res = results;
            })
            if(res.length == 0){
                return null;
            }
            return res;
        }
        catch(e){
            throw e;
        }
    }
    
    async updatePassword(user):Promise<any>{
        try{
            let res;
            await this.customerRepository.update(
                {password:user.password},
                {where:{[Op.or]:[{mobileNumber:user.username},{email:user.username}]},
            returning:true})
            .then(result=>{
                res = result;
            })
            return res;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    }

}
