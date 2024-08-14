import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SignUpDto } from './sign-up.dto';
import {Customer}  from './sign-up.entity'
import * as moment from 'moment';
import { Sequelize } from 'sequelize-typescript';
import { Op,QueryTypes } from 'sequelize';
import { Database } from '../database/database.interface';


@Injectable()
export class SignUpService {
    constructor(
        @Inject('CUSTOMER_REPOSITORY')
        private customerRepository :typeof Customer
    ){}

    async findAllCustomer():Promise<Customer[]>{
        let res;
        try{
             await this.customerRepository.findAll()
             .map(el => el.get({ plain: true }))
             .then(results=>{
              res = results;
            })
            return res;
        }
        catch(e){
            console.log(e.message);
            throw e
        }
        
    }

    async findCustomer(mobileorEmail){
        try{
            const databaseConfig: Database = {
                dialect: "mysql",
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                define: {
                    freezeTableName: true
                },
                dialectOptions: {
                    options: {
                      requestTimeout: 3000
                    }
                  },
                  pool: {
                    max: 10,
                    min: 0,
                    idle: 10000
                  },
                // query:{
                //     type:dbConnection.QueryTypes.SELECT
                // }
            };
            const sequelize = new Sequelize(databaseConfig);
                const sqlQuery = `SELECT * FROM homeneeds.Customer WHERE 
                mobileNumber = :mobileorEmail or email =:mobileorEmail;`
                let results = await sequelize.query(sqlQuery,
                    {
                        replacements:{mobileorEmail:mobileorEmail},
                        type:QueryTypes.SELECT
                    }
                );
                sequelize.close();
                return results;
        }
        catch(e){
            throw e;
        }
    }

    async createUser(user:SignUpDto):Promise<Customer>{
        try{
           
            user.createdAt = moment().format('YYYY-MM-DD hh:mm:ss').toString();
             //user.updatedAt = moment().format('YYYY-MM-DD hh:mm:ss').toString();
            const res = await this.customerRepository.create(user);
            
            return res;
        }
        catch(e){
            throw e;
        }
    }
}
