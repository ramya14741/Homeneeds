import { Inject, Injectable } from '@nestjs/common';
import { ProductDetail } from './product-detail.entity';
import { ProductDetailDto } from './product-detail.dto';
import { productProvider } from '../product/product.provider';
import { Op } from 'sequelize';

@Injectable()
export class ProductDetailService {
    constructor(@Inject('PRODUCTDETAIL-REPOSITORY')
    private productDetailRepository:typeof ProductDetail){}

    async addProductDetail(productDetail):Promise<ProductDetail>
    {
        try{
            return await this.productDetailRepository.create(productDetail);
        }
        catch(e){
            throw e;
        }
    }

    async getProductDetail(productid):Promise<ProductDetailDto[]>{
        let res;
        try{
            await this.productDetailRepository.findAll({
                where:{
                    productid:productid
                }
            }).map(el=>el.get({plain:true}))
            .then(results=>{
                res= results;
            })
            return res;
        }
        catch(e){
            throw e;
        }
    }

    async getallProductDetail():Promise<ProductDetailDto[]>{
        let res;
        try{
            await this.productDetailRepository.findAll()
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

    async getDiscountProducts():Promise<ProductDetailDto[]>{
        let res;
        try{
            await this.productDetailRepository.findAll({
                where:{
                    isdiscountAvail :'Y'
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

    async findProducts(orderData):Promise<ProductDetailDto[]>{
        const productid =[];
        const stock_Sku =[];
        let res;
        try{
            orderData.productData.forEach(o=>{
                productid.push(o.productid);
            });
            orderData.productData.forEach(o=>{
                stock_Sku.push(o.stock_Sku)
            });
            await this.productDetailRepository.findAll({
                where:{
                    productId:{
                        [Op.in]:productid
                    },
                    stock_Sku:{
                        [Op.in]:stock_Sku
                    }
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

    async UpdatebyWarehouseAdmin(productid, salePrice, MRPPrice):Promise<ProductDetail>{
        let res;
        try{
            await this.productDetailRepository.update({
                salePrice :salePrice,
                retailPrice:MRPPrice
            },{
                where:{
                    productid:productid
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
    
}
