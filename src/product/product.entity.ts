//import { CONNREFUSED } from 'dns';
import { Column, DataType, Model, Table, PrimaryKey } from 'sequelize-typescript';
//import { DecimalDataType } from 'sequelize/types';
@Table
export class Product extends Model{

    @Column({
        type:DataType.INTEGER,
        autoIncrement : true,
        primaryKey:true
    })
    productId:number;
    @Column({
        type:DataType.STRING,
    })
    productName:string;
    @Column({
        type:DataType.STRING,
        primaryKey:true
    })
    sku:string;
    @Column({
        type:DataType.STRING
    })
    desc:string;
    @Column({
        type:DataType.CHAR
    })
    isAvail:string
    @Column({
        type:DataType.STRING
    })
    supplierId:string
    @Column({
        type:DataType.STRING
    })
    createdUser: string
    @Column({
        type:DataType.STRING
    })
    updatedUser:string
    @Column({
        type:DataType.INTEGER
    })
    Category_categoryId:number
    @Column({
        type:DataType.STRING
    })
    Category_category_Sku:string
    @Column({
        type:DataType.INTEGER
    })
    Brand_brandId:number
    @Column({
        type:DataType.STRING
    })
    Brand_brand_Sku:string
    @Column({
        type:DataType.STRING
    })
    deleteInd:string
}
