import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table 
export class customerfav extends Model{
    @Column({
        type:DataType.INTEGER,
        primaryKey:true,
        autoIncrement:true
    })
    favId:Number
    @Column({
        type:DataType.STRING
    })
    mobileNumber:String
    @Column({
        type:DataType.STRING
    })
    email:String
    @Column({
        type:DataType.INTEGER
    })
    productId:Number
    @Column({
        type:DataType.CHAR
    })
    isFav:String

}