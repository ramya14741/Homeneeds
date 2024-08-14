import { Inject, Injectable } from '@nestjs/common';
import { refundDTO } from './refund.dto';
import { RefundDetails } from './refund.entity';
import { Database } from '../database/database.interface';
import { Sequelize } from 'sequelize-typescript';
import { Op,QueryTypes } from 'sequelize';

@Injectable()
export class RefundService {
    constructor(@Inject('REFUNDDETAIL-REPOSITORY') 
    private refundRepository:typeof RefundDetails){}
async createRefund(refundData:refundDTO):Promise<RefundDetails>{
    try{
        return await this.refundRepository.create(refundData)
    }
    catch(e){
        throw e;
    }
}


async getRefundDetailsData(fromDate,toDate):Promise<RefundDetails[]>{
    let res;
    try{
        await this.refundRepository.findAll({
            where:{
                createdAt:{
                    [Op.between]:[fromDate,toDate]
                }
            }
        })
        .then(results=>{
            res = results;
        })
        return res;
    }
    catch(e){
        throw e;
    }
}

async updateRefundStatus(refundId, refundData):Promise<RefundDetails>{
    let res;
    try{
        await this.refundRepository.update({
            refundStatusData:refundData
        },{where:{
            idRefundDetails:refundId
        }, returning:true}).then(results=>{
            res = results;
        })
        return res;
    }
    catch(e){
        throw e;
    }
}

async getRefundDetails(fromDate,toDate){
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
            const sqlQuery = `SELECT count(distinct orderId) as count FROM homeneeds.RefundDetails
            WHERE createdAt between :fromDate and :toDate;`
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

async getTotalRefundOrderCount(){
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
            const sqlQuery = `SELECT COUNT(DISTINCT orderId) as totalRefundCount from  homeneeds.RefundDetails`
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

