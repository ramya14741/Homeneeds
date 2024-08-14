import { Column, Table, DataType, Model } from 'sequelize-typescript';

@Table
export class ProductFeedback extends Model{
    @Column({
        type:DataType.INTEGER,
        autoIncrement:true,
        primaryKey:true
    })
    idproductFeedback:Number
    @Column({
        type:DataType.INTEGER
    })
    productRating:Number
    @Column({
        type:DataType.STRING
    })
    productReview:String
    @Column({
        type:DataType.INTEGER
    })
    Product_productId:Number
    @Column({
        type:DataType.STRING
    })
    stock_sku:String
    @Column({
        type:DataType.STRING
    })
    Customer_mobileNumber
    @Column({
        type:DataType.STRING
    })
    Customer_email:String
}