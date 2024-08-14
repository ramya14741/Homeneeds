import { Inject, Injectable } from '@nestjs/common';
import { ProductFeedback } from './product-feedback.entity';
import { ProductFeedbackDto } from './product-feedback.dto';
import { Database } from '../database/database.interface';
import { Op, QueryTypes, Sequelize } from 'sequelize';

@Injectable()
export class ProductFeedbackService {
    constructor(@Inject('PRODUCTFB_REPOSITORY')
    private productFbRepository:typeof ProductFeedback){}
    
async getProductFeedback(productid):Promise<ProductFeedback[]>{
    let res;
    try{
        await this.productFbRepository.findAll({
            where:{
                Product_productId:productid
            }
        }).map(el=>el.get({plain:true}))
        .then(results=>{
            res = results;
        })
        return res;
    }
    catch(e){
        return e;
    }
}

async saveFeedback(feedback:ProductFeedbackDto):Promise<ProductFeedback>{
    try{
        return await this.productFbRepository.create(feedback);
    }
    catch(e){
        return e;
    }
}

async getAllProductFeedback():Promise<ProductFeedback[]>{
    let res;
    try{
        await this.productFbRepository.findAll()
        .map(el=>el.get({plain:true}))
        .then(results=>{
            res = results;
        })
        return res;
    }
    catch(e){
        return e;
    }
}

async getFeedbackDetailforDashboard(fromDate, toDate) {
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
        const sqlQuery = `SELECT p.productName,p.desc,f.* FROM homeneeds.ProductFeedback f
        join homeneeds.Product p
        on p.productId = f.Product_productId
            WHERE f.createdAt BETWEEN :fromDate AND :toDate;`
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


}
