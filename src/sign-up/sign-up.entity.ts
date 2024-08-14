import {Table, Column, Model, PrimaryKey, DataType} from 'sequelize-typescript'
//import { IntegerDataType } from 'sequelize/types'
import internal from 'stream'

@Table 
export class Customer extends Model {
    @Column({
        type: DataType.STRING,
    primaryKey: true
    })
    mobileNumber: string;
    @Column({
        type: DataType.STRING
    })
    userName:string;
    @Column({
        type: DataType.STRING,
        primaryKey: true
    })
    email: string;
    @Column({
        type: DataType.STRING
    })
    createdAt:string;
    @Column({
        type: DataType.STRING
    })
    password:string;
    @Column({
        type:DataType.CHAR
    })
    CustomerType:string
}
