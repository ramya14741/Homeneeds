import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table
export class category extends Model{
    @Column({
        type:DataType.STRING,
        //autoIncrement:true,
        primaryKey:true
    })
    categoryId:String
    @Column({
        type:DataType.STRING
    })
    categoryType:String
    @Column({
        type:DataType.STRING
    })
    categoryDesc:String
    // @Column({
    //     type:DataType.STRING
    // })
    // createdAt:String
    // @Column({
    //     type:DataType.STRING
    // })
    // updatedAt:String
    @Column({
        type:DataType.STRING
    })
    deleteInd:String
    @Column({
        type:DataType.STRING
    })
    createdUser:String
    @Column({
        type:DataType.STRING
    })
    updatedUser:String
    @Column({
        type:DataType.STRING
    })
    category_Sku:String
    @Column({
        type:DataType.STRING
    })
    imageName:String
    @Column({
        type:DataType.STRING
    })
    imageUrl:String
}