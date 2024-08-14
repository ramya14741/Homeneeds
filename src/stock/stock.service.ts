import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import { ProductDetailService } from '../product-detail/product-detail.service';
import { Database } from '../database/database.interface';
import { StockDto } from './stock.dto';
import { Stock } from './stock.entity';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { ProductService } from '../product/product.service';
import { ProductAdminDto } from '../product/product.dto';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ImageService } from '../image/image.service';
dotenv.config();
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
export class StockService {
    constructor(@Inject('STOCK-REPOSITORY')
    private stockRepository:typeof Stock,
    private productDetailService:ProductDetailService,
   // private productService:ProductService,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
    @Inject(forwardRef(() => ImageService))
    private imageService: ImageService,){}

async getStock(productId):Promise<Stock[]>{
    let res;
    try{
        await this.stockRepository.findAll({
            where:{
                [Op.and]:[{productid:productId}]
            }
        }).map(el=>el.get({plain:true}))
        .then(results=>{
            res= results;
        })
        return res;
    }
    catch(e){
        return e;
    }
}

async postStock(stock:StockDto,params,url):Promise<Stock>{
    try{
        const res =  await this.stockRepository.create(stock);
        const sku = res.getDataValue('id')+stock.productName.substring(0,5);
        const skuUpdate = this.updateStockProductSku(res.getDataValue('id'),sku);
        const productReq  = {
            productName:stock.productName,
            sku:sku,
            desc:stock.productDesc,
            isAvail:'Y',
            supplierId:'1',
            Category_categoryId:stock.categoryId,
            Category_category_Sku:stock.category
        };
        const productInsert = await this.productService.saveProducts(productReq);
        const stockProductId = this.updateProductId(res.getDataValue('id'),productInsert.getDataValue('productId'))
        const productDetailReq ={
            productid:productInsert.getDataValue('productId'),
            salePrice:stock.salePrice,
            retailPrice:stock.MRPPrice,
            stock_Sku:sku
        };
        const productDetailInsert = await this.productDetailService.addProductDetail(productDetailReq);
        
    //     const getsignedUrlParam ={
    //         Bucket :params.Bucket,
    //         Key:params.Key
    //         //Region:process.env.region
    //     }
    //     const s3SignedUrl = new GetObjectCommand(getsignedUrlParam);
    //    // s3.config.region  process.env.region
    //     const url = await getSignedUrl(s3, s3SignedUrl);
        const imageReq ={
            imagesurl:url,
            imageCode:params.Key,
            Product_productId:productInsert.getDataValue('productId'),
            Product_sku:sku
        }
        const addImage = this.imageService.addImage(imageReq);
        return res;
    }
    catch(e){
        return e;
    }
}
async updateProductId(stockid,productid):Promise<Stock>{
    let res;
    try{
        await this.stockRepository.update({
            productid:productid
        },{
            where:{
                id:stockid
            }
        })
    }
    catch(e){
        return e;
    }
}
async updateStockProductSku(stockid,sku){
    let res;
    try{
        await this.stockRepository.update({
            stock_Sku :sku
        },{
            where:{
                id:stockid
            }
        }).then(results=>{
            res =results
        })
        return res;
    }
    catch(e){
        throw e;
    }
}


async searchStock(text,pageno){
        
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
        let limit = 25
        let offset = 0 + (pageno - 1) * limit
        const sequelize = new Sequelize(databaseConfig);
            const sqlQuery = `SELECT s.*,c.categoryType FROM
             homeneeds.Stock s
             JOIN homeneeds.category c
             on c.category_Sku = s.category
            WHERE s.productName like '%${text}%'
            AND s.deleteInd ='N'
            LIMIT :LIMIT OFFSET :OFFSET`
            let results = await sequelize.query(sqlQuery,
                {
                    replacements:{LIMIT:limit,OFFSET:offset,text:text},
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

async findAllStock(){
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
            const sqlQuery = `SELECT s.*,c.categoryType FROM
            homeneeds.Stock s
            JOIN homeneeds.category c
            on c.category_Sku = s.category
            WHERE s.deleteInd ='N'`
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

async getAllStock(pageno){
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
        let limit = 25
        let offset = 0 + (pageno - 1) * limit
        const sequelize = new Sequelize(databaseConfig);
            const sqlQuery = `SELECT s.*,c.categoryType FROM
            homeneeds.Stock s
            JOIN homeneeds.category c
            on c.category_Sku = s.category
            WHERE s.deleteInd ='N'
            LIMIT :LIMIT OFFSET :OFFSET`
            let results = await sequelize.query(sqlQuery,
                {
                    replacements:{LIMIT:limit,OFFSET:offset},
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

async updateUnits(productid, category,quantity):Promise<any>{
    let res;
    const previousUnits =  await this.getStock(productid);
    let unitSold = previousUnits[0].unitsSold+quantity;
    let ordersRecieved = Number(previousUnits[0].ordersRecieved)+1;
    let unitsLeft = Number(previousUnits[0].unitsLeft)-quantity;
    try{

        // if(unitsLeft == 0){
        //     await this.sendStockNotification(previousUnits[0]);
        // }
        await this.stockRepository.update({
            unitsSold:unitSold,
            unitsLeft:unitsLeft,
            ordersRecieved:ordersRecieved

        },
        {
            where:{
                productid:productid,
                category:category
            }
        }).then(
            results=>{
                res = results;
            })
            return res;

    }
    catch(e){
        throw e;
    }

}

async sendStockNotification?(product): Promise<boolean> {   
    let transporter = nodemailer.createTransport(
        {
            host: process.env.mailhost,
            port: process.env.mailport,
            service: process.env.mailservice,
            auth: {
                type: process.env.mailtype,
                user: process.env.mailfrom,
                clientId: process.env.clientId,
                clientSecret: process.env.clientsecret,
                refreshToken: process.env.refreshToken,
                accessToken: process.env.accessToken
            }
        });
    let mailoptions = {
        type: "login",
        from: 'homeneedstbn@gmail.com',
        to: process.env.stockNotificationEmail,
        subject: 'StockOver Notification',
        text: 'StockOver Notification',
        html: 'Hi! <br><br> Stock got over for the product ProductName - '+product.productName+'  ProductId-'+product.productId+'.Kindly Reload the stock<br><br>' 
    };
    let mailsend = await new Promise<boolean>(async function (resolve, reject) {
        return await transporter.sendMail(mailoptions, async (error, info) => {
            if (error) {
                console.log(error);
                return reject(false);
            }
            return resolve(true);
        });
    })
    return mailsend;
}


async reduceUnits(productid, category,quantity):Promise<any>{
    let res;
    const previousUnits =  await this.getStock(productid);
    let unitSold = Number(previousUnits[0].unitsSold)-quantity;
    let ordersRecieved = Number(previousUnits[0].ordersRecieved)-1;
    let unitsLeft = Number(previousUnits[0].unitsLeft)+quantity;

    try{

        await this.stockRepository.update({
            unitsSold:unitSold,
            unitsLeft:unitsLeft,
            ordersRecieved:ordersRecieved

        },
        {
            where:{
                productid:productid,
                category:category
            }
        }).then(
            results=>{
                res = results;
            })
            return res;

    }
    catch(e){
        throw e;
    }

}



async getOrdersBasedonCategory(fromDate,toDate){
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
            const sqlQuery = `SELECT category , SUM(ordersRecieved) as OrdersRecieved 
            from mydb.Stock 
            WHERE createdAt BETWEEN :fromDate AND :toDate
            group by category;`
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

async updateStockbyWarehouseAdmin(stock,productid):Promise<Stock>{
    let res;
    try{
        await this.stockRepository.update({
            totalUnits:stock.quantity,
            salePrice:stock.salePrice,
            MRPPrice:stock.MRPPrice
        },{
            where:{
                productid:productid
            }
        }).then(results=>{
            res = results;
        })
        if(res){
           const productdetail = await this.productDetailService.UpdatebyWarehouseAdmin(productid, stock.salePrice, stock.MRPPrice)
        }
        return res;
    }
    catch(e){
        throw e;
    }
}

async deleteStockbyAdmin(productid):Promise<Stock>{
    let res;
    try{
        await this.stockRepository.update({
            deleteInd:'Y'
        },{
            where:{
                productid:productid
            }
        }).then(results=>{
            res = results
        })
        return res;
    }
    catch(e){
        throw e;
    }
}
}
