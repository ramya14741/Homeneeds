import { STRING } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class ProductImages extends Model{
@Column({
    type:DataType.INTEGER,
    autoIncrement:true,
    primaryKey:true
})
id:Number
@Column({
    type:DataType.STRING
})
imagesurl:String
@Column({
    type:DataType.STRING
})
imageDesc:String
@Column({
    type:DataType.INTEGER
})
Product_productId:Number
@Column({
    type:DataType.STRING
})
Product_sku:String
@Column({
    type:DataType.STRING
})
imageCode:String
}