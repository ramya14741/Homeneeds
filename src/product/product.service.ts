import { Inject, Injectable } from '@nestjs/common';
import { resourceLimits } from 'worker_threads';
import { Product } from './product.entity';
import { ProductAdminDto, ProductDto } from './product.dto';
import { ImageService } from '../image/image.service';
import { ProductDetailService } from '../product-detail/product-detail.service';
import { ProductFeedbackService } from '../product-feedback/product-feedback.service';
import { StockService } from '../stock/stock.service';
import { ProductFeedback } from '../product-feedback/product-feedback.entity';
//import { Op } from 'sequelize';
import { ProductImages } from '../image/image.entity';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import { Database } from '../database/database.interface';
import { substring } from 'sequelize/types/lib/operators';

@Injectable()
export class ProductService {
    constructor(@Inject('PRODUCT_REPOSITORY')
    private productRepository: typeof Product,
        private imageService: ImageService,
        private productDetailService: ProductDetailService,
        private productFeedbackService: ProductFeedbackService,
        private stockService: StockService
    ) { }
    async findAllProductsbyPageNo(pageno){
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
                const sqlQuery = `SELECT *
                FROM homeneeds.Product p
                JOIN homeneeds.ProductDetail pd
                on p.productId = pd.productid
                LEFT JOIN homeneeds.ProductFeedback pf
                on pf.Product_productId = pd.productid
                LEFT JOIN homeneeds.ProductImages pi
                on pi.Product_productId = pd.productid
                LEFT JOIN homeneeds.Stock s
                on s.productid = pi.Product_productId
                AND p.deleteInd ='N'
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

    async findAllProducts(){
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
                const sqlQuery = `SELECT *
                FROM homeneeds.Product p
                JOIN homeneeds.category c
                on c.category_Sku = p.Category_category_Sku
                JOIN homeneeds.ProductDetail pd
                on p.productId = pd.productid
                LEFT JOIN homeneeds.ProductFeedback pf
                on pf.Product_productId = pd.productid
                LEFT JOIN homeneeds.ProductImages pi
                on pi.Product_productId = pd.productid
                LEFT JOIN homeneeds.Stock s
                on s.productid = pi.Product_productId
                AND p.deleteInd ='N'`
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

    // async findAllProducts(): Promise<ProductDto[]> {
    //     //let productImages:Object[] =[];
    //     let res;
    //     //res.productImages;
    //     try {
    //         await this.productRepository.findAll()
    //             .map(el => el.get({ plain: true }))
    //             .then(results => {
    //                 res = results;
    //             })
    //         const stock = await this.stockService.getAllStock();
    //         const imagedata = await this.imageService.getAllImages();
    //         const productDetail = await this.productDetailService.getallProductDetail();
    //         const productFeedback = await this.productFeedbackService.getAllProductFeedback();

    //         if (productDetail && stock) {
    //             productDetail.forEach(p => {
    //                 p.stockavail = false;
    //                 p.Quantity = 0;
    //                 stock.forEach(s => {
    //                     if (s.stock_Sku == p.stock_Sku && (s.unitsLeft != null && s.unitsLeft > 0)) {
    //                         p.stockavail = true;
    //                         p.Quantity = s.unitsLeft;
    //                     }
    //                 })
    //             })
    //         }
    //         // if(productDetail && productFeedback){
    //         //     productDetail.forEach(p=>{
    //         //         p.productFeedback =[];
    //         //         productFeedback.forEach(f=>{
    //         //             if((f.stock_sku == p.stock_Sku)){
    //         //                 p.productFeedback.push(f);
    //         //             }
    //         //         })
    //         //     })
    //         // }

    //         res.forEach(p => {
    //             p.productImages = [];
    //             imagedata.forEach(i => {
    //                 if (p.productId == i.Product_productId)
    //                     p.productImages.push(i);
    //             })
    //         })
    //         res.forEach(p => {
    //             p.productDetail = [];
    //             productDetail.forEach(
    //                 prodetail => {
    //                     if (p.productId == prodetail.productid)
    //                         p.productDetail.push(prodetail)
    //                 }
    //             )
    //         })
    //         res.forEach(p => {
    //             p.productFeedback = [];
    //             productFeedback.forEach(feedback => {
    //                 if (p.productId == feedback.Product_productId)
    //                     p.productFeedback.push(feedback);
    //             })
    //         })



    //         return res;
    //     }
    //     //
    //     catch (e) {
    //         console.log(e)
    //         throw e;
    //     }
    //}
    async saveProducts(product): Promise<Product> {
        try {
            const res =  await this.productRepository.create(product);
            const sku = res.getDataValue('productId')+product.productName.substring(0,5);
            const skuUpdate = this.updateProductSku(res.getDataValue('productId'),sku);
            return res;
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }

    async updateProductSku(productid,sku):Promise<Product>{
        let res;
        try{
            await this.productRepository.update({
                sku :sku
            },{
                where:{
                    productId:productid
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

    async getTotalProductCount(){
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
                const sqlQuery = `SELECT count(distinct productId) as totalProductCount FROM homeneeds.Product;`
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

    async getProductAddedafterDate(fromDate):Promise<any>{
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
                const sqlQuery = `SELECT * FROM homeneeds.Product WHERE createdAt>=:fromDate;`
                let results = await sequelize.query(sqlQuery,
                    {
                        replacements:{fromDate:fromDate},
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

    async getTotalProductCountBasedonCategory(){
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
                const sqlQuery = `SELECT Category_categoryId,count(distinct productId) as totalProductCount,c.categoryType  FROM homeneeds.Product  p
                JOIN homeneeds.category c
                on c.categoryId = p.Category_categoryId
                group by Category_categoryId;`
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


    // async findProductByCategory(category,pageno): Promise<Product[]> {
    //     try {
    //         let limit = 25
    //         let offset = 0 + (pageno - 1) * limit
    //         let res;
    //         await this.productRepository.findAll({
    //             offset: offset,
    //             limit: limit,
    //             where: {
    //                 Category_category_Sku: {
    //                     [Op.in]:category
    //                 }
    //             }
    //         })
    //             .map(el => el.get({ plain: true }))
    //             .then(results => {
    //                 res = results;
    //             })
    //             const stock = await this.stockService.getAllStock();
    //             const imagedata = await this.imageService.getAllImages();
    //             const productDetail = await this.productDetailService.getallProductDetail();
    //             const productFeedback = await this.productFeedbackService.getAllProductFeedback();
    
    //             if (productDetail && stock) {
    //                 productDetail.forEach(p => {
    //                     p.stockavail = false;
    //                     p.Quantity = 0;
    //                     stock.forEach(s => {
    //                         if (s.stock_Sku == p.stock_Sku && (s.unitsLeft != null && s.unitsLeft > 0)) {
    //                             p.stockavail = true;
    //                             p.Quantity = s.unitsLeft;
    //                         }
    //                     })
    //                 })
    //             }
    //             // if(productDetail && productFeedback){
    //             //     productDetail.forEach(p=>{
    //             //         p.productFeedback =[];
    //             //         productFeedback.forEach(f=>{
    //             //             if((f.stock_sku == p.stock_Sku)){
    //             //                 p.productFeedback.push(f);
    //             //             }
    //             //         })
    //             //     })
    //             // }
    
    //             res.forEach(p => {
    //                 p.productImages = [];
    //                 imagedata.forEach(i => {
    //                     if (p.productId == i.Product_productId)
    //                         p.productImages.push(i);
    //                 })
    //             })
    //             res.forEach(p => {
    //                 p.productDetail = [];
    //                 productDetail.forEach(
    //                     prodetail => {
    //                         if (p.productId == prodetail.productid)
    //                             p.productDetail.push(prodetail)
    //                     }
    //                 )
    //             })
    //             res.forEach(p => {
    //                 p.productFeedback = [];
    //                 productFeedback.forEach(feedback => {
    //                     if (p.productId == feedback.Product_productId)
    //                         p.productFeedback.push(feedback);
    //                 })
    //             })
    
    
    
    //             return res;
    //         }
    //         //
    //         catch (e) {
    //             console.log(e)
    //             throw e;
    //         }
    //     }

    async findProductByCategory(category,pageno) {
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
                const sqlQuery = `SELECT *
                FROM homeneeds.Product p
                JOIN homeneeds.ProductDetail pd
                on p.productId = pd.productid
                AND p.Category_category_Sku IN (:category)
                LEFT JOIN homeneeds.ProductFeedback pf
                on pf.Product_productId = pd.productid
                LEFT JOIN homeneeds.ProductImages pi
                on pi.Product_productId = pd.productid
                LEFT JOIN homeneeds.Stock s
                on s.productid = pi.Product_productId
                AND p.deleteInd ='N'
                LIMIT :LIMIT OFFSET :OFFSET`
                let results = await sequelize.query(sqlQuery,
                    {
                        replacements:{LIMIT:limit,OFFSET:offset,category:category},
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

    async findProductbybarcode(sku) {
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
                const sqlQuery = `SELECT *
                FROM homeneeds.Product p
                JOIN homeneeds.ProductDetail pd
                on p.productId = pd.productid
                AND p.sku IN (:sku)`
                let results = await sequelize.query(sqlQuery,
                    {
                        replacements:{sku:sku},
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
    async searchProduct(text,pageno){
        
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
                const sqlQuery = `SELECT *
                FROM homeneeds.Product p
                JOIN homeneeds.ProductDetail pd
                on p.productId = pd.productid
                LEFT JOIN homeneeds.ProductFeedback pf
                on pf.Product_productId = pd.productid
                LEFT JOIN homeneeds.ProductImages pi
                on pi.Product_productId = pd.productid
                LEFT JOIN homeneeds.Stock s
                on s.productid = pi.Product_productId
                WHERE p.productName like '%${text}%'
                AND p.deleteInd ='N'
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

    async findProductById(id) {
        try {
            // await this.productRepository.findOne({
            //     where: { productId: id }
            // })
            //     .then(results => {
            //         res = results;
            //     })
            // const stock = await this.stockService.getStock(id);
            // const imagedata = await this.imageService.getProductImages(id);
            // const productDetail = await this.productDetailService.getProductDetail(id);
            // const productFeedback = await this.productFeedbackService.getProductFeedback(id);
            // productDetail.forEach(p => {
            //     p.stockavail = false;
            //     p.Quantity = 0;
            //     stock.forEach(s => {
            //         if (s.stock_Sku == p.stock_Sku && (s.unitsLeft != null && s.unitsLeft > 0)) {
            //             p.stockavail = true;
            //             p.Quantity = s.unitsLeft;
            //         }
            //     })
            // })
            // // if(productDetail && productFeedback){
            // //     productDetail.forEach(p=>{
            // //         p.productFeedback =[];
            // //         productFeedback.forEach(f=>{
            // //             if((f.stock_sku == p.stock_Sku)){
            // //                 p.productFeedback.push(f);
            // //             }
            // //         })
            // //     })
            // // }
            // res.dataValues.productImages = imagedata;
            // res.dataValues.productDetail = productDetail;
            // res.dataValues.productFeedback = productFeedback;
            // return res;
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
                const sqlQuery = `SELECT *
                FROM homeneeds.Product p
                JOIN homeneeds.ProductDetail pd
                on p.productId = pd.productid
                AND p.productId =:id
                AND p.deleteInd ='N'
                LEFT JOIN homeneeds.ProductFeedback pf
                on pf.Product_productId = pd.productid
                LEFT JOIN homeneeds.ProductImages pi
                on pi.Product_productId = pd.productid
                LEFT JOIN homeneeds.Stock s
                on s.productid = pi.Product_productId`
                let results = await sequelize.query(sqlQuery,
                    {
                        replacements:{id:id},
                        type:QueryTypes.SELECT
                    }
                );
                sequelize.close();
                return results;
        }
        catch (e) {
            throw e;
        }
    }

    async updateProduct(product, productid):Promise<Product>{
        let res;
        try{
            const skuSubString = product.productName.substring(0,5);
            const sku = productid+skuSubString;
            await this.productRepository.update({
                productName:product.productName,
                sku:sku,
                desc:product.desc,
                isAvail:product.isAvail,
                supplierId:product.supplierId,
                Category_categoryId:product.Category_categoryId,
                Category_category_Sku:product.Category_category_Sku
            },{
                where:{
                    productId:productid
                }
            }).then(results=>{
                res = results;
            })
            return res;
        }
        catch(e){
            throw e;
        }
    }

    async deleteProductbyId(productId):Promise<any>{
       try {
            return await this.productRepository.destroy({
                where:{
                    productId:productId
                }
            })
        }
        catch(e){
            throw e;
        }
    }

    async deleteProductByAdmin(productid):Promise<Product>{
        let res;
        try {
            await this.productRepository.update({
                deleteInd:'Y'
            },{
                where:{
                    productId:productid
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
