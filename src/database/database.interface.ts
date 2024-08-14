import { Dialect } from "sequelize/types";

export interface Database {
    dialect?: Dialect,
    host?:string,
    port?:number,
    username?: string,
    password?:string,
    database?:string,
    define:{
        freezeTableName?:boolean
    },
    dialectOptions?:{
        options?:{
            requestTimeout:number
        }
    },
    pool?:{
        max:number,
        min:number,
        idle:number
    },
    query?:any
    
}
