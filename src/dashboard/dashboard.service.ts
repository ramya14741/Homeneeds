import { forwardRef, Inject, Injectable } from '@nestjs/common';
//import { Sequelize } from 'sequelize-typescript';
//import { QueryTypes } from 'sequelize/types';
import { Database } from '../database/database.interface';
import { OrderTrackingService } from '../order-tracking/order-tracking.service';
import { PaymentService } from '../auth/payment';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import { S3Client, PutObjectCommand,GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from 'dotenv';
import { CategoryService } from '../category/category.service';
import { cpuUsage } from 'process';
import { Admin } from './admin.entity';
import { AdminDto } from './admin.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { OfferService } from '../offer/offer.service';
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
//const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
dotenv.config();
//import aws from 'aws-sdk'
const region = process.env.region;
const accessKey = process.env.awsAccessKeyId;
const secretAccessKey = process.env.awsSecretAccessKey;
const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
    },
    region: region,

})

@Injectable()
export class DashboardService {
    constructor(@Inject('ADMIN-REPOSITORY')
    private adminRepository:typeof Admin,
        private paymentService: PaymentService,
        //private authService:AuthService,
       // @Inject(forwardRef(() => AuthService))
    //private authService: AuthService,
        private orderTrackingService: OrderTrackingService,
      //  @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
    private offerService:OfferService) { }
    async getRevenue(fromDate, toDate) {
        try {
            const settlement = await this.paymentService.getRevenue(fromDate, toDate);

            return settlement;
        }
        catch (e) {
            return e;
        }
    }

    async topLessStock(pageno) {
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
            let limit = 25
            let offset = 0 + (pageno - 1) * limit
            const sequelize = new Sequelize(databaseConfig);
            const sqlQuery = `SELECT productid, productName, productDesc, unitsLeft FROM homeneeds.Stock WHERE unitsLeft < 5 
            and deleteInd ='N'
            order by UnitsLeft asc
            LIMIT :LIMIT OFFSET :OFFSET;`
            let results = await sequelize.query(sqlQuery,
                {
                    replacements:{LIMIT:limit,OFFSET:offset},
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

    async topSellingStock(pageno) {
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
            let limit = 25
            let offset = 0 + (pageno - 1) * limit
            const sequelize = new Sequelize(databaseConfig);
            const sqlQuery = `SELECT productid, productName, productDesc, unitsSold
             FROM homeneeds.Stock WHERE deleteInd ='N' Order by unitsSold Desc
             LIMIT :LIMIT OFFSET :OFFSET;`
            let results = await sequelize.query(sqlQuery,
                {
                    replacements:{LIMIT:limit,OFFSET:offset},
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


    async getOrdersBasedonCategory(fromDate, toDate) {
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
            const sqlQuery = `SELECT category , SUM(ordersRecieved) as OrdersRecieved from mydb.Stock 
                WHERE createdAt BETWEEN :fromDate AND :toDate
                group by category;`
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


    
    // async getS3Url():Promise<any>
    // async adminLogin(user){
    //     try{
    //         return this.authService.adminLogin(user);
    //     }
    //     catch(e){
    //         throw e;
    //     }
        
    // }

    async getOrderCount(fromDate, toDate, status) {
        return await this.orderTrackingService.getOrderCount(fromDate, toDate, status);
    }
    async getTotalOrderCount(fromDate, toDate) {
        return await this.orderTrackingService.getTotalOrderCount(fromDate, toDate);
    }

    async addOfferfromDashboard(params,offerId,offerName) {
        try {
            const OfferReq ={
                idOffer:offerId,
                productId:offerName,
                imageKey:params.Key
            }
            const addOffer = await this.offerService.addOffer(OfferReq);
            const command = new PutObjectCommand(params)
            const s3Response =  s3.send(command);

            console.log(s3Response);
            return s3Response
        }
        catch(e){
            throw e;
        }
}

async addCategoryfromDashboard(params,categoryId,categoryName) {
    try {
        const categoryReq ={
            categoryId:categoryId,
            categoryType:categoryName,
            imageName:params.Key
        }
        const addCategory = await this.categoryService.addCategory(categoryReq);
        const command = new PutObjectCommand(params)
        const s3Response =  s3.send(command);

        console.log(s3Response);
        return s3Response
    }
    catch(e){
        throw e;
    }
}


async getCategorywithImage(){
    try{
        const bucketName = process.env.bucketName;
        const category = await this.categoryService.getCategories();
       // const getObjectParams={}
        for(const c of category){
            if(c.imageName!==null){
                const getObjectParams ={
                    Bucket :bucketName,
                    Key:c.imageName.toString()
                }
                const command = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, command);
                c.imageUrl = url;
            }
        }

        return category;
     
    }
    catch(e){
        throw e;
    }
}

async getOfferWithImage(){
    try{
        const bucketName = process.env.offerbucketName;
        const offer = await this.offerService.getAllOffers();
       // const getObjectParams={}
        for(const o of offer){
            if(o.imageKey!==null){
                const getObjectParams ={
                    Bucket :bucketName,
                    Key:o.imageKey.toString()
                }
                const command = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, command);
                o.imageUrl = url;
            }
        }

        return offer;
     
    }
    catch(e){
        throw e;
    }
}

// async createInvoice(){
//     try{
//         return await this.paymentService.createInvoice();
//     }
//     catch(e){
//         throw e;
//     }
// }

async getInvoice(invoiceid){
    try{
        return await this.paymentService.getInvoice(invoiceid);
    }
    catch(e){
        throw e;
    }
}


async getAllInvoices(){
    try{
        return await this.paymentService.getAllInvoices();
    }
    catch(e){
        throw e;
    }
}
async findAdminbyName(adminName):Promise<AdminDto[]>{
    let res;
    try{
         await this.adminRepository.findAll({
            where:{
                AdminName:adminName
            }
        }).map(el=>el.get({plain:true}))
        .then(results=>{
            res=results;
        })
        return res;
    }
    catch(e){
        throw e;
    }
}


async deleteImage(imageName){
    try{
        //const getCategory = await this.categoryService.get
        const bucketName = process.env.bucketName;
        const ObjectParams ={
            Bucket :bucketName,
            Key:imageName.toString()
        }

        const command = new DeleteObjectCommand(ObjectParams);
        const res = await s3.send(command);
        return res;
        
    }
    catch(e){
        throw e;
    }
}
}
