import { ProductDTO } from "../order-detail/order-detail.dto";

//import { DataTypeFloat } from 'sequelize';
export class refundDTO{
    idRefundDetails?:Number;
    orderId:String;
    refundAmount:String;
    refundProductReq?:ProductDTO[];
    refundStatusData?:{};
}