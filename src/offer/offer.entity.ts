import { Column, DataType, Table,Model } from "sequelize-typescript";
//import { Model } from "sequelize/types";

@Table
export class Offer extends Model{
    @Column({
        type:DataType.INTEGER,
        autoIncrement:true,
        primaryKey:true
    })
    idOffer:Number
    @Column({
        type:DataType.INTEGER
    })
    productId:Number

    @Column({
        type:DataType.STRING
    })
    offerStartDate:String
    @Column({
        type:DataType.STRING
    })
    imageUrl:String
    @Column({
        type:DataType.STRING
    })
    imageKey:String
    @Column({
        type:DataType.STRING
    })
    offerEndDate:String
    @Column({
        type:DataType.STRING
    })
    productName:String
    @Column({
        type:DataType.STRING
    })
    salePrice:String
    @Column({
        type:DataType.STRING
    })
    discountPrice:String
}
