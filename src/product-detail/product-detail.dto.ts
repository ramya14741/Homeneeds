import { ProductFeedbackDto } from '../product-feedback/product-feedback.dto';
export class ProductDetailDto{
    idproductDetail?:Number;
    productid:Number;
    weight:string;
    salePrice:string;
    retailPrice:string;
    discount?:string;
    Quantity?:Number;
    isdiscountAvail?:string;
    stock_Sku:string;
    stockavail?:boolean;
    productFeedback:ProductFeedbackDto[];
}