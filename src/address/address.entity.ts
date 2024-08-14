import { Table, DataType, PrimaryKey, Column, Model } from 'sequelize-typescript';
import { Database } from '../database/database.interface';

@Table
export class Address extends Model{
    @Column({
        type:DataType.INTEGER,
        primaryKey:true,
        autoIncrement:true
    })
    idAddress:Number
    @Column({
        type:DataType.STRING
    })
    addressType:String
    @Column({
        type:DataType.STRING
    })
    addressLine1:String
    @Column({
        type:DataType.STRING
    })
    addressLine2:String
    @Column({
        type:DataType.STRING
    })
    city:String
    @Column({
        type:DataType.STRING
    })
    state:String
    @Column({
        type:DataType.INTEGER
    })
    zip:Number
    @Column({
        type:DataType.STRING
    })
    Customer_mobileNumber:String
    @Column({
        type:DataType.STRING
    })
    Customer_email:String
    @Column({
        type:DataType.STRING
    })
    name:String
    
}