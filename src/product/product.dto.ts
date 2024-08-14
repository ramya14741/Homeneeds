import { imageDto } from '../image/image.dto';
import { ProductDetailDto } from '../product-detail/product-detail.dto';
import { ProductFeedbackDto } from '../product-feedback/product-feedback.dto';
export class ProductDto{

    productId?: number;
    productName:string;
    sku:string;
    desc?:string;
    isAvail:string;
    supplierId:string;
    productImages:imageDto[];
    productDetail:ProductDetailDto[];
    //productFeedback:ProductFeedbackDto[];
    createdAt?:string;
    updatedAt?:string;
    createdUser?:string;
    updatedUser?:string;
    Category_categoryId:number;
    Category_category_Sku:string;
    Brand_brandId:number;
    Brand_brand_Sku:string; 
}

export class ProductAdminDto{
    productId?: number;
    productName:string;
    sku?:string;
    desc:string;
    isAvail:string;
    supplierId:string;
    createdUser?:string;
    updatedUser?:string;
    Category_categoryId:number;
    Category_category_Sku:string;
}