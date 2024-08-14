import { Inject, Injectable } from '@nestjs/common';
import { orderTracking } from './order-tracking.entity';
import { OrderTrackingDTO } from './order-tracking.dto';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import { Database } from '../database/database.interface';

@Injectable()
export class OrderTrackingService {
    constructor(@Inject('ORDERTRACKING-REPOSITORY')
    private orderTrackingRepository:typeof orderTracking
    ){}

async trackorder(id):Promise<orderTracking>{
    try{
        let res;
        await this.orderTrackingRepository.findOne({
            where:{idOrderTracking:id}
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

async getOrderCount(fromDate,toDate,status){
    let res;
    try{
        await this.orderTrackingRepository.count({
            where:{
               createdAt:{
                [Op.between]:[fromDate,toDate],
               } ,
                deliveryStatus:status
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

async getTotalOrderCount(fromDate,toDate){
    let res;
    try{
        await this.orderTrackingRepository.count({
            where:{
               createdAt:{
                [Op.between]:[fromDate,toDate],
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

async OrderDetailDashboard(fromDate, toDate) {
    try {
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
        const sqlQuery = `SELECT * FROM homeneeds.orderTracking o
        join homeneeds.OrderDetails od
        on o.idOrderTracking = od.orderTrackingId
            WHERE o.createdAt BETWEEN :fromDate AND :toDate
            AND od.orderType!='POS'`
        let results = await sequelize.query(sqlQuery,
            {
                replacements: { fromDate: fromDate, toDate: toDate },
                type: QueryTypes.SELECT
            }
        );
        sequelize.close();
        return results;
    }
    catch (e) {
        throw e;
    }
}

async postOrderTracking(ordertracking:OrderTrackingDTO):Promise<orderTracking>{
    try{
        return await this.orderTrackingRepository.create(ordertracking)
    }
    catch(e){
        throw e;
    }
}
async updateOrderStatus(id, deliveryStatus){
    let res;
    await this.orderTrackingRepository.update({
        deliveryStatus:deliveryStatus
    },
    {
        where:{idOrderTracking:id}, returning:true
    }).then(results=>{
            res= results;
        })
        return res;
    }
    catch(e){
        throw e;
    }
}
