import { Column, Model, Table, PrimaryKey, DataType } from 'sequelize-typescript';
//import { DataTypeFloat } from 'sequelize';
//import { Json } from 'sequelize/types/lib/utils';

@Table
export class RefundDetails extends Model{
    @Column({
        type:DataType.INTEGER,
        primaryKey:true,
        autoIncrement:true
    })
    idRefundDetails:Number;
@Column({
    type:DataType.STRING
})
orderId:String
@Column({
    type:DataType.FLOAT
})
refundAmount:Number
@Column({
    type:DataType.JSON
})
refundProductReq:{}
@Column({
    type:DataType.JSON
})
refundStatusData:{}
}