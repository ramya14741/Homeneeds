import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table
export class Admin extends Model{
    @Column({
        type:DataType.INTEGER,
        primaryKey:true,
        autoIncrement:true
    })
    idAdmin:Number
    @Column({
        type:DataType.STRING
    })
    AdminName:String
    @Column({
        type:DataType.STRING
    })
    AdminPassword:String
    @Column({
        type:DataType.STRING
    })
    AdminType:String
    @Column({
        type:DataType.STRING
    })
    Role:String
}