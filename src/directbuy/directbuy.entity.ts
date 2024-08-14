import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table
export class directBuy extends Model{

    @Column({
        type:DataType.INTEGER,
        autoIncrement:true,
        primaryKey:true
    })
    idDirectBuy: number
    @Column({
        type:DataType.INTEGER
    })
    productId:Number
    @Column({
        type:DataType.STRING
    })
    weight:string
    @Column({
        type:DataType.STRING
    })
    productName:string
    @Column({
        type:DataType.STRING
    })
    price:string
    @Column({
        type:DataType.STRING
    })
    product_sku:string
    @Column({
        type:DataType.STRING
    })
    quantity:string
    @Column({
        type:DataType.STRING
    })
    Customer_mobileNumber:String
    @Column({
        type:DataType.STRING
    })
    Customer_email:string
    @Column({
        type:DataType.STRING
    })
    stock_sku:String
}