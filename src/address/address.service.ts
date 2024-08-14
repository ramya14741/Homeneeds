import { Inject, Injectable } from '@nestjs/common';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import { Address } from './address.entity';
import { AddressDto } from './address.dto';
import { threadId } from 'worker_threads';
import { databaseConfig } from '../database/database.providers';
import { Database } from '../database/database.interface';

@Injectable()
export class AddressService {
    constructor(@Inject('ADDRESS_REPOSITORY')
    private addressRepository:typeof Address){}

    async getAddress(mobileorEmail):Promise<Address[]>{
        try{
            let res;
            await this.addressRepository.findAll({
                where:{
                    [Op.or]:[{Customer_mobileNumber:mobileorEmail},{Customer_email:mobileorEmail}]
                }
            }).map(el=>el.get({plain:true}))
            .then(results=>{
                res= results;
            })
            if(res.length ==0){
                return null;
            }
            return res;
        }
        catch(e){
            throw e;
        }
    }

    async getAddressbyId(id):Promise<Address>{
        try{
            let res;
            await this.addressRepository.findAll({
                where:{
                    idAddress:id
                }
            }).map(el=>el.get({plain:true}))
            .then(results=>{
                res= results;
            })
            if(res.length ==0){
                return null;
            }
            return res[0];
        }
        catch(e){
            throw e;
        }
    }

async addAddress(address:AddressDto):Promise<Address>{
    let res;
    try{
        return await this.addressRepository.create(address)
    }
    catch(e){
        throw e;
    }
}
async updateAddress(address:AddressDto,idAddress:number):Promise<Address>{
    let res;
    try{
        await this.addressRepository.update(
               {addressLine1:address.addressLine1,
                addressLine2:address.addressLine2,
                city:address.city,
                state:address.state,
                addressType:address.addressType,
                name:address.name,
                zip:address.zip,
                Customer_mobileNumber:address.Customer_mobileNumber,
                Customer_email:address.Customer_email
                },
            {where:{
              idAddress:idAddress
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

async deleteAddress(idAddress:number):Promise<any>{
    let res;
    try{
        const orderStatus = await this.getOrdersprioraddrDel(idAddress)
        if(orderStatus){
            return 'Cannot delete address since order related to the address is in progress'
        }
        return await this.addressRepository.destroy(
            {
                where:{
                    idAddress:idAddress
                }
            }
        )
    }
    catch(e){
        throw e;
    }
}

async getOrdersprioraddrDel(addressId):Promise<any>{
    try{
        const databaseConfig: Database = {
            dialect: "mysql",
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            define: {
                freezeTableName: true
            },
            dialectOptions: {
                options: {
                  requestTimeout: 3000
                }
              },
              pool: {
                max: 10,
                min: 0,
                idle: 10000
              },
            // query:{
            //     type:dbConnection.QueryTypes.SELECT
            // }
        };
        const sequelize = new Sequelize(databaseConfig);
            const sqlQuery = `SELECT count(1) FROM homeneeds.OrderDetails O
            JOIN homeneeds.orderTracking T
           on O.orderTrackingId = T.idOrderTracking
           AND T.deliveryStatus NOT IN ('Delivered','Cancelled')
           AND O.shippingAddressId =:addressId;`
            let results = await sequelize.query(sqlQuery,
                {
                    replacements:{addressId:addressId},
                    type:QueryTypes.SELECT
                }
            );
            sequelize.close();
            return results;
    }
    catch(e){
        throw e;
    }
}
}