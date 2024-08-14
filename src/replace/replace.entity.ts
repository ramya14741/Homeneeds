import { Column, Table, PrimaryKey, Model, DataType } from 'sequelize-typescript';

@Table
export class ReplaceDetails extends Model{
    @Column({
        type:DataType.INTEGER,
        primaryKey:true,
        autoIncrement:true
    })
    idReplaceDetails:Number;
    @Column({
        type:DataType.JSON
    })
    productData:{}
    @Column({
        type:DataType.STRING
    })
    replaceStatus:String
    @Column({
        type:DataType.STRING
    })
    orderId:String
}