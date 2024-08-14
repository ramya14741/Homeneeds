import { Injectable } from '@nestjs/common';
import { fromEventPattern } from 'rxjs';
import {Sequelize} from 'sequelize-typescript'
import { rootCertificates } from 'tls';
import {Customer} from '../sign-up/sign-up.entity';
//import * as dotenv from 'dotenv'
import { Database } from './database.interface';
import { Product } from '../product/product.entity';
import { Cart } from '../cart/cart.entity';
import { Address } from '../address/address.entity';
import { ProductImages } from '../image/image.entity';
import { ProductDetail } from '../product-detail/product-detail.entity';
import { Stock } from '../stock/stock.entity';
import { ProductFeedback } from '../product-feedback/product-feedback.entity';
import { OrderDetails } from '../order-detail/order-detail.entity';
import { orderTracking } from '../order-tracking/order-tracking.entity';
import { env } from 'process';
import * as dotenv from 'dotenv'
import { RefundDetails } from '../refund/refund.entity';
import { ReplaceDetails } from '../replace/replace.entity';
import { category } from '../category/category.entity';
import { customerfav } from '../customer_fav/customer-fav.entity';
import { Offer } from '../offer/offer.entity';
import { directBuy } from '../directbuy/directbuy.entity';
import { Admin } from '../dashboard/admin.entity';
//require('dotenv').config();
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
//import {dotenv} from '../'
// const path = require('path')
// const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../dotenv') })


export const databaseConfig:Database={
    dialect:"mysql",
    host:process.env.DB_HOST,
    port:Number(process.env.DB_PORT),
    username:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
    define: {
        freezeTableName: true
      },
};

export const DatabaseProviders  =[
    {
        provide: 'Sequelize',
        useFactory:async()=>{
            const sequelize = new Sequelize(databaseConfig);
            sequelize.addModels([Admin,directBuy,Offer,customerfav,Customer,category,Product, Cart, Address,ReplaceDetails, RefundDetails,OrderDetails,ProductImages, ProductDetail, Stock, ProductFeedback, orderTracking]);
            try{
               await sequelize.sync();
               await sequelize.authenticate();
            }
            catch(e){
                throw e.message||e;
            }
            return sequelize;
        }

    }
]
