/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable } from '@nestjs/common';
import { ProductDetailService } from '../product-detail/product-detail.service';
import { PaymentService } from '../auth/payment';
import { OrderUpateDTO, postOrderDetailDTO, OrderDetailDeliveryDTO } from './order-detail.dto';
import { OrderDetails } from './order-detail.entity';
import { Op,QueryTypes } from 'sequelize';
import { OrderTrackingService } from '../order-tracking/order-tracking.service';
import sequelize from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from '../database/database.providers';
const { v4: uuidv4 } = require('uuid');
const dbConnection = require('sequelize');
//const path = require('path')
import { Database } from '../database/database.interface';
import { ProductService } from '../product/product.service';
import { ImageService } from '../image/image.service';
import { Observable } from 'rxjs';
//import { iRegexp } from 'sequelize/types/lib/operators';
import { refundDTO } from '../refund/refund.dto';
import { RefundService } from '../refund/refund.service';
import { SignInService } from '../sign-in/sign-in.service';
import { AddressService } from '../address/address.service';
import { ListBucketIntelligentTieringConfigurationsCommand } from '@aws-sdk/client-s3';
const path = require('path')
import * as moment from 'moment';
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../dotenv') })
@Injectable()
export class OrderDetailService {
    constructor(@Inject('ORDERDETAIL-REPOSITORY')
    private orderDetailRepository: typeof OrderDetails,
        private productDetailService: ProductDetailService,
        private paymentService: PaymentService,
        private orderTrackingService: OrderTrackingService,
        private productService: ProductService,
        private imageService:ImageService,
        private refundService:RefundService,
        private signInService:SignInService,
        private addressService:AddressService) { }

    async createOrder(OrderData) {
        let price = [];
        let finalPrice;
        try {
            const lineitem=[];
            const productData = await this.productDetailService.findProducts(OrderData);
            productData.forEach(p => {
                OrderData.productData.forEach(o => {
                    if (o.productid == p.productid)
                        p.Quantity = o.Quantity;
                })
            })
            productData.forEach(p=>{
                OrderData.productData.forEach(o=>{
                    if(o.productid == p.productid){
                        lineitem.push({
                            name: o.productName,
                            description: o.productName,
                            "amount": Number(p.salePrice)*100,
                            "currency": "INR",
                            "quantity": p.Quantity
                        })
                    }
                })
            })
            const deliveryCharge = lineitem.push({
                name: 'deliveryCharge',
                description: 'deliveryCharge',
                "amount": 50*100,
                "currency": "INR"
            })
            // if (productData.length > 1) {
            //     productData.forEach(p => {
            //         price.push(Number(p.Quantity) * Number(p.salePrice))
            //         // lineItem.push({
            //         //     "name": p.,
            //         //     "description": "Book by Ravena Ravenclaw",
            //         //     "amount": 399,
            //         //     "currency": "INR",
            //         //     "quantity": 1
            //         // })
            //     })
            //     finalPrice = price.reduce((a, b) => a + b, 0)
            // }
            // else {
            //     finalPrice = Number(productData[0].Quantity) * Number(productData[0].salePrice);
            // }
            // const orderReq = {
            //     "amount": finalPrice * 100,
            //     "currency": "INR",
            //     "receipt": uuidv4(),
            //     "payment": {
            //         "capture": "automatic",
            //         "capture_options": {
            //             "automatic_expiry_period": 12,
            //             "manual_expiry_period": 7200,
            //             "refund_speed": "optimum"
            //         }
            //     }
            // }
           // const order = await this.paymentService.createOrder(orderReq);
            const customerInfo = await this.signInService.findUser(OrderData.mobileNumber||OrderData.email)
            const address = await this.addressService.getAddressbyId(OrderData.billingAddressId);
           // const lineItem.
           const Date = moment().add(20, 'minutes').unix();
    // const UnixTimeStamp = Math.floor(Date.getTime()/1000);
    // const expiry = UnixTimeStamp+(1*60);
            const createInvoiceReq ={
                "type": "invoice",
                "description": "Invoice for the order ",
                "partial_payment": false,
                "customer": {
                  "name": customerInfo[0].userName,
                  "contact": customerInfo[0].mobileNumber,
                  "email": customerInfo[0].email,
                  "billing_address": {
                    "line1": address.addressLine1,
                    "line2": address.addressLine2,
                    "zipcode": address.zip,
                    "city": address.city,
                    "state": address.state,
                    "country": "india"
                  },
                  "shipping_address": {
                    "line1": address.addressLine1,
                    "line2": address.addressLine2,
                    "zipcode": address.zip,
                    "city": address.city,
                    "state": address.state,
                    "country": "india"
                  }
                },
                //"order_id":order.id,
                "line_items": lineitem,
                "sms_notify": 0,
                "email_notify": 0,
                "currency": "INR",
                "expire_by":Date
            }
            console.log(JSON.stringify(createInvoiceReq));
            const invoice = await this.paymentService.createInvoice(createInvoiceReq);
            const postOrderData = {
                id: invoice.order_id,
                entity: invoice.entity,
                amount: invoice.amount,
                shippingAddressId: OrderData.shippingAddressId,
                amount_paid: invoice.amount_paid,
                Customer_mobileNumber: OrderData.mobileNumber,
                Customer_email: OrderData.email,
                billingAddressId: OrderData.billingAddressId,
                ProductJson: OrderData.productData,
                amount_due: invoice.amount_due,
                currency: invoice.currency,
                receipt: invoice.receipt,
                offer_id: invoice.offer_id,
                status: invoice.status,
                attempts: invoice.attempts,
                notes: invoice.notes,
                orderTrackingId: uuidv4(),
                invoiceId:invoice.id,
                invoiceUrl:invoice.short_url
            }
            const TrackingData = {
                idOrderTracking: postOrderData.orderTrackingId,
                deliveryStatus: 'NotStarted',
                deliveryType: 'Online'
            }
            const postOrder = await this.postOrderDetail(postOrderData);
            const createTracking = await this.orderTrackingService.postOrderTracking(TrackingData);
            // const res ={
            //     orderRes:order,
            //     invoice:invoice
            // }
            return invoice;
        }
        catch (e) {
            return e;
        }
    }
    async postOrderDetail(postOrderData: postOrderDetailDTO): Promise<postOrderDetailDTO> {
        try {
            return await this.orderDetailRepository.create(postOrderData);
        }
        catch (e) {
            return e;
        }
    }

    async getMaxPOSOrderId() {
        try {
            const sequelize = new Sequelize(databaseConfig);
            const sqlQuery = `
            SELECT CASE WHEN MAX(uniqueId) IS NULL THEN '0' ELSE MAX(uniqueId)   END  AS MaxId FROM 
            homeneeds.OrderDetails WHERE orderType != 'ONLINE';`
            let results = await sequelize.query(sqlQuery, {
                type: QueryTypes.SELECT
            });
            sequelize.close();
            return results;
        }
        catch (e) {
            throw e;
        }
    }

    async createPOSOrder(postOrderData): Promise<any> {
        try {
           const maxId = await this.getMaxPOSOrderId();
            const orderId: any = maxId[0];
            postOrderData.id = 'HNPOS0000' + orderId.MaxId;
            postOrderData.orderType ='POS';
             return await this.orderDetailRepository.create(postOrderData);
        }
        catch (e) {
            return e;
        }
    }

    async verifyPayment(orderReq): Promise<any> {
        try {
            const fetchOrder = await this.paymentService.verifyPayment(orderReq);
            //let orderUpdateReq = OrderUpateDTO;
            const orderUpdateReq = {
                amount_due: fetchOrder.amount_due,
                amount_paid: fetchOrder.amount_paid,
                attempts: fetchOrder.attempts,
                status: fetchOrder.status
            }
            const orderUpdate = await this.orderUpdate(orderReq.orderCreationId, orderUpdateReq);
            if (orderUpdate[1] == 1 && fetchOrder.status == 'paid')
                return 'payment verified successfully';
        }
        catch (e) {
            throw e;
        }
    }

    async refundPaymentNormal(refundReq:refundDTO):Promise<any>{
        try{
            const createRefundReq = await this.refundService.createRefund(refundReq)
           const refund = await this.paymentService.refundPayment(refundReq.orderId, refundReq.refundAmount);
           if(refund){
               const updateRefund = await this.refundService.updateRefundStatus(createRefundReq.idRefundDetails,refund)
           }
           console.log(JSON.stringify(refund));
           return refund;
        }
        catch (e) {
            throw e;
        }
    }

    async getOrderDetail(orderId): Promise<OrderDetails> {
        let res;
        await this.orderDetailRepository.findAll({
            where: {
                id: orderId
            }
        }).map(el => el.get({ plain: true }))
            .then(results => {
                res = results;
            })
        return res;
    }
    catch(e) {
        throw e;
    }

    async orderUpdate(orderId, orderReq): Promise<any> {
        let res;
        try {
            await this.orderDetailRepository.update({
                amount_paid: orderReq.amount_paid,
                amount_due: orderReq.amount_due,
                status: orderReq.status,
                attempts: orderReq.attempts
            }, {
                where: {
                    id: orderId
                }, returning: true
            }).then(results => {
                res = results;
            })
            return res;
        }
        catch (e) {
            throw e;
        }
    }

    async getOrderBasedOnCustomer(mobileNumberorEmail): Promise<any> {
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
                const sqlQuery = `SELECT   distinct o.orderTrackingId,a.idAddress,a.addressType,a.addressLine1,r.refundAmount,r.refundProductReq,
                r.refundStatusData,
                                a.addressLine2,a.state,a.zip,a.Customer_mobileNumber,a.Customer_email,
                                a.name,id,ProductJson,deliveryStatus,invoiceId,invoiceUrl,o.createdAt,o.updatedAt 
                                FROM homeneeds.OrderDetails o
                               left join homeneeds.orderTracking t
                                on o.orderTrackingId = t.idorderTracking
                                and o.orderType!='POS'
                               left join homeneeds.RefundDetails r
                                on r.orderId = o.id
                               left join homeneeds.Address a
                                on o.shippingAddressId = a.idAddress
                WHERE (o.Customer_mobileNumber=:mobileNumberorEmail
                OR o.Customer_email=:mobileNumberorEmail)
                order by o.createdAt desc;`
                let results = await sequelize.query(sqlQuery,
                    {
                        replacements:{mobileNumberorEmail:mobileNumberorEmail},
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
    
    async getOrderWaitingForDelivery() {
        let results: any;
        //let productDetail;
        let productDetail: {
            orderid,
            productData

        }
        let orderid;
        let productData = [];
        //let productFinal = [];
       
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
            const sqlQuery = `SELECT a.*,t.shippingDetailId,t.idorderTracking,id,ProductJson,deliveryStatus,o.invoiceId,o.invoiceUrl
            FROM homeneeds.OrderDetails o
        join homeneeds.orderTracking t
        on o.orderTrackingId = t.idorderTracking
        and o.orderType!='POS'
        left join homeneeds.Address a
        on o.shippingAddressId = a.idAddress
        WHERE t.deliveryStatus in('NotStarted','Dispatched');`
            const productQuery = `SELECT p.productName,pd.weight,p.productId FROM homeneeds.product p
        join homeneeds.productdetail pd
        on p.productId = pd.productId
        and pd.stock_Sku in (:product_Sku)
        and p.productId in (:product_id);`
            results = await sequelize.query(sqlQuery);
            //console.log(results[0]);
            //const productDelivery = []
            //  for(let i=0;i<=results.length;i++){
            //     for(let j =0;j<=results[i].ProductJson.length;j++){
            //         const productDetail = await this.productService.findProductById(results[i].ProductJson[j].productid)
            //     }
            // }
            // const res = this.productDetail(results[0]);
            // results[0].forEach(async r => {
            //     orderid = r.id;
            //     //r.productFinal =[];
            //     let productId ;
            //     let stock_Sku ;
            //     r.ProductJson.forEach(async p => {
            //         productId=p.productid;
            //         stock_Sku=p.stock_Sku;
            //    p.productFinal=[];
            //     const productData =  await sequelize.query(productQuery, {
            //         replacements: { product_id: productId, product_Sku: stock_Sku }
            //     });

            //     productDetail = {
            //         orderid: orderid,
            //         productData: productData
            //     }
            //     p.productFinal.push(productDetail);
            //      });
            //     // productDetail.orderid = orderid;
            //     // productDetail.productData = productData;
            //     console.log('r',r);
            // });
            const [image] = await this.getimgePromise(results[0]);
          // const image = await this.getImages(results[0]);
console.log(image);
console.log(results[0][0]);
const output = results[0];
let imageFinal =[];
image.forEach(i=>{
    i.forEach(im=>{
        imageFinal.push(im);
    })
})
let outputFinal =[];
// output.forEach(o=>{
//     o.forEach(op=>{
//         outputFinal.push(op);
//     })
// })
output.forEach(r=>{
    r.ProductJson.forEach(rp=>{
        imageFinal.forEach(i=>{
            if(rp.productid == i.Product_productId){
                rp.productImages=[];
                rp.productImages.push(i);
            }
    })
    })
    
    console.log(output);
})
sequelize.close();
        return output;
            //     const results = await databaseConfig.query(
            //         'SELECT id,ProductJson FROM mydb.orderdetails o
            //         join ordertracking t
            //      console.log(image);   on o.orderTrackingId = t.idorderTracking
            //         WHERE t.deliveryStatus ='NotStarted''
            //     )
        }
        catch (e) {
            throw e;
        }
    }

    async getimgePromise(r):Promise<any>{
        let res;
        let result =[];
        let apicall =[];
            await r.forEach( e=>{
               for(const p in e.ProductJson){
                   apicall.push(this.getImages(e.ProductJson[p]))
               }
                });
                res =  await Promise.all(apicall).then(res=>{
                    result.push(res);
                    console.log(result);
            })
            return result;
    }
     async getImages(product):Promise<any> {
        //  new Promise(async (resolve,reject)=>{
        // product.forEach(async p=>{
        // await p.ProductJson.forEach(async ps=>{
        //     let image;
        //    const result =  await this.imageService.getProductImages(ps.productid).then(res=>{
        //         image =res;
        //         ps.imageUrl = image;
        //         ps.imageslink = result;
        //     });
        // })
        // })
        // return resolve(product);
        // await product.forEach(async p=>{
        //     let imageCall =[];
        //     for(const pj of p.ProductJson){
        //         imageCall.push()
                 return await this.imageService.getProductImages(product.productid);
                //pj.imageUrl = image;
               //});
            // /
        //})
        }
       
    ///})
        
    

    async getImagesbyProductId(p){
        return await this.imageService.getProductImages(p);
    }
    async productDetail(request): Promise<any> {
        let productDetail: {};
        let orderid;
        let productData = [];
        let productFinal = [];
        let productId = [];
        //productDetail.id;
        request.forEach(r => {
            orderid = r.id;

            r.ProductJson.forEach(p => {
                productId.push(p.productid)
            });
            console.log('productData', productData);
            productDetail = {
                orderid: orderid,
                productData: productData

            }
            productFinal.push(productDetail);
        })
        return productFinal;
    }
    async findProduct(product) {
        let productDetail;
        return await this.productService.findProductById(product.productid);
        // return productDetail;
    }

    async viewDeliveredOrders(fromDate,toDate){
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
                const sqlQuery = `SELECT count(distinct o.id) as totalcount FROM homeneeds.OrderDetails o
                join homeneeds.orderTracking t
                on o.orderTrackingId = t.idorderTracking
                and o.orderType!='POS'
                WHERE o.createdAt between :fromDate and :toDate
                AND t.deliveryStatus ='Delivered'
                AND o.id NOT IN (SELECT distinct r.orderId from homeneeds.ReplaceDetails r)`
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

    
    async getDeliveredOrdersCount(){
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
                const sqlQuery = `SELECT COUNT(id) as count FROM homeneeds.OrderDetails o
                join homeneeds.orderTracking t
                on o.orderTrackingId = t.idorderTracking
                and o.orderType!='POS' 
                left join homeneeds.Address a
                on o.shippingAddressId = a.idAddress
                AND t.deliveryStatus ='Delivered'
                AND o.id NOT IN (SELECT distinct r.orderId from homeneeds.ReplaceDetails r)`
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

    async viewDeliveredOrdersData(fromDate,toDate){
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
                const sqlQuery = `SELECT  o.orderTrackingId,a.*,id,ProductJson,deliveryStatus,
                invoiceId,invoiceUrl FROM homeneeds.OrderDetails o
                join homeneeds.orderTracking t
                on o.orderTrackingId = t.idorderTracking
                AND o.orderType!='POS'
                left join homeneeds.Address a
                on o.shippingAddressId = a.idAddress
                WHERE o.createdAt between :fromDate and :toDate
                AND t.deliveryStatus ='Delivered'
                AND o.id NOT IN (SELECT distinct r.orderId from homeneeds.ReplaceDetails r)`
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

    async getPOSRevenue(fromDate,toDate){
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
                const sqlQuery = `SELECT SUM(amount_paid) as totalAmount FROM homeneeds.OrderDetails where createdAt 
                between :fromDate and :toDate
                AND orderType ='POS'
                GROUP BY orderType;`
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


    async getPOSOrders(fromDate,toDate){
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
                const sqlQuery = `SELECT * FROM homeneeds.OrderDetails where createdAt 
                between '2022-09-13' and '2022-09-14'
                AND orderType ='POS';`
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

    async viewAllOrdersData(fromDate,toDate){
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
                const sqlQuery = `SELECT  o.orderTrackingId,a.*,id,ProductJson,deliveryStatus,invoiceId,invoiceUrl
                 FROM homeneeds.OrderDetails o
                join homeneeds.orderTracking t
                on o.orderTrackingId = t.idorderTracking
                AND o.orderType!='POS'
                left join homeneeds.Address a
                on o.shippingAddressId = a.idAddress
                WHERE o.createdAt between :fromDate and :toDate
                AND o.id NOT IN (SELECT distinct r.orderId from homeneeds.ReplaceDetails r)`
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

    async viewAllOrders(fromDate,toDate){
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
                const sqlQuery = `SELECT count(distinct o.id) as totalcount 
                FROM homeneeds.OrderDetails o
                WHERE o.createdAt between :fromDate and :toDate
                AND o.orderType!='POS'
                AND o.id NOT IN (SELECT distinct r.orderId from homeneeds.ReplaceDetails r)`
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

    

    async getTotalOrderCount(){
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
                const sqlQuery = `SELECT COUNT(DISTINCT id) as totalOrderCount from  homeneeds.OrderDetails o
                WHERE o.orderType!='POS'`
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
