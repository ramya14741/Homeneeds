//import { DataTypeFloat } from 'sequelize';
import { Column, Table, DataType, Model } from 'sequelize-typescript';

@Table
export class OrderDetails extends Model{
    @Column({
        type:DataType.INTEGER,
        primaryKey:true,
        autoIncrement:true
    })
    uniqueId:Number;
    @Column({
        type:DataType.STRING,
        primaryKey:true
    })
    id:String;
    @Column({
        type:DataType.STRING,
    })
    entity:String
    @Column({
        type:DataType.STRING,
    })
    orderType:String
    @Column({
        type:DataType.FLOAT
    })
    amount:Number
    @Column({
        type:DataType.INTEGER
    })
    shippingAddressId:Number
    @Column({
        type:DataType.FLOAT
    })
    amount_paid:Number
    @Column({
        type:DataType.STRING
    })
    Customer_mobileNumber:String
    @Column({
        type:DataType.STRING
    })
    Customer_email:String
    @Column({
        type:DataType.INTEGER
    })
    billingAddressId:Number
    @Column({
        type:DataType.JSON
    })
    ProductJson:{}
    // @Column({
    //     type:DataType.INTEGER
    // })
    // ShippingDetails_idShippingDetails:Number
    // @Column({
    //     type:DataType.STRING
    // })
    // deliveryType:String
    // @Column({
    //     type:DataType.STRING
    // })
    // deliveryStatus:String
    @Column({
        type:DataType.INTEGER
    })
    amount_due:Number
    @Column({
        type:DataType.STRING
    })
    currency:String
    @Column({
        type:DataType.STRING
    })
    receipt:String
    @Column({
        type:DataType.STRING
    })
    offer_id:String
    @Column({
        type:DataType.STRING
    })
    status:String
    @Column({
        type:DataType.INTEGER
    })
    attempts:Number
    @Column({
        type:DataType.JSON
    })
    notes:{}
    @Column({
        type:DataType.STRING
    })
    orderTrackingId:String
    @Column({
        type:DataType.STRING
    })
    invoiceId:String
    @Column({
        type:DataType.STRING
    })
    invoiceUrl:String

}
