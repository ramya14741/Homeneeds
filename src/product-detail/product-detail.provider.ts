import { ProductDetail } from './product-detail.entity';
export const productDetailProvider =[{
    provide:'PRODUCTDETAIL-REPOSITORY',
    useValue:ProductDetail,
}]