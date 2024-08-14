import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table
export class orderTracking extends Model{
    @Column({
        type:DataType.STRING,
        primaryKey:true
    })
    idOrderTracking:String
    @Column({
        type:DataType.STRING
    })
deliveryType:String
@Column({
    type:DataType.STRING
})
deliveryStatus:String
@Column({
    type:DataType.INTEGER
})
shippingDetailId:Number
// @Column({
//     type:DataType.STRING
// })
// createdAt?: String;
// @Column({
//     type:DataType.STRING
// })
// updatedAt?: String
}