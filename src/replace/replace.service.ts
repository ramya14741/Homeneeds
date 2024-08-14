import { Inject, Injectable } from '@nestjs/common';
//import { Op } from 'sequelize';
import { RefundDetails } from '../refund/refund.entity';
import { ReplaceDetails } from './replace.entity';
import { Sequelize } from 'sequelize-typescript';
import { Op,QueryTypes } from 'sequelize';
import { Database } from '../database/database.interface';

@Injectable()
export class ReplaceService {
    constructor(@Inject('REPLACEDETAIL-REPOSITORY')
    private replaceRepository:typeof ReplaceDetails){}
    async createReplace(replaceData):Promise<ReplaceDetails>{
        try{
            return await this.replaceRepository.create(replaceData)
        }
        catch(e){
            throw e;
        }
    }
async updateReplaceStatus(replaceId, replaceStatus):Promise<ReplaceDetails>{
let res;
try{
    await this.replaceRepository.update({
        replaceStatus:replaceStatus
    },{where:{
        idReplaceDetails:replaceId
    },returning:true}).then(results=>{
        res=results;
    })
    return res;
}
catch(e){
    throw e;
}
}

async getReplaceDetails():Promise<any>{

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
            const sqlQuery = `SELECT a.*,t.* FROM homeneeds.OrderDetails o
            join homeneeds.ReplaceDetails t
            on o.id = t.orderId
            left join homeneeds.Address a
            on o.shippingAddressId = a.idAddress
            AND o.orderType!='POS'`
            let results = await sequelize.query(sqlQuery,
                {
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
async getReplacedProductsData(fromDate,toDate):Promise<any>{
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
            const sqlQuery = `SELECT a.*,t.* FROM homeneeds.OrderDetails o
            join homeneeds.ReplaceDetails t
            on o.id = t.orderId
            left join homeneeds.Address a
            on o.shippingAddressId = a.idAddress
            WHERE o.createdAt between :fromDate and :toDate
            AND o.orderType!='POS'`
            let results = await sequelize.query(sqlQuery,
                {
                    replacements:{fromDate:fromDate,toDate:toDate},
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

async getReplacedProducts(fromDate,toDate):Promise<any>{
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
            const sqlQuery = `SELECT count(distinct o.id) as totalcount  FROM homeneeds.OrderDetails o
            join homeneeds.ReplaceDetails t
            on o.id = t.orderId
            WHERE o.createdAt between :fromDate and :toDate
            AND o.orderType!='POS'`
            let results = await sequelize.query(sqlQuery,
                {
                    replacements:{fromDate:fromDate,toDate:toDate},
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

async getTotalReplaceOrderCount(){
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
            const sqlQuery = `SELECT COUNT(DISTINCT orderId) as totalOrderCount from  homeneeds.ReplaceDetails`
            let results = await sequelize.query(sqlQuery,
                {
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


