import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { substring } from 'sequelize/types/lib/operators';
import { DashboardService } from '../dashboard/dashboard.service';
import { category } from './category.entity';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import { Database } from '../database/database.interface';

@Injectable()
export class CategoryService {
    constructor(@Inject('CATEGORY-REPOSITORY')
    private categoryRepository:typeof category,
    @Inject(forwardRef(() => DashboardService))
    private dashboardService: DashboardService,){}
    async getCategories():Promise<category[]>{
        let res;
        try{
            await this.categoryRepository.findAll()
            .map(el=>
                el.get({plain:true}))
                .then(results=>{
                    res = results;
                })
                return res;
        }
        catch(e){
            throw e;
        }
    }

    async addCategory(Category):Promise<category>{
        try{
            const idSubString = Category.categoryId.substring(0,1);
            const typeSubString = Category.categoryType.substring(0,5);
            const categorySku = idSubString.concat(typeSubString);
            Category.category_Sku = categorySku;
            return await this.categoryRepository.create(Category);
        }
        catch(e){
            throw e;
        }

    }

    async getCategoryAddedafterDate(fromDate):Promise<any>{
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
                const sqlQuery = `SELECT * FROM homeneeds.category WHERE createdAt>=:fromDate;`
                let results = await sequelize.query(sqlQuery,
                    {
                        replacements:{fromDate:fromDate},
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
    async getTotalCategoryCount(){
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
                const sqlQuery = `SELECT count(distinct categoryId) as totalCount FROM homeneeds.category;`
                let results = await sequelize.query(sqlQuery,
                    {
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

    async updateCategory(category, idCategory):Promise<category>{
        let res;
        try{
            const idSubString = idCategory.substring(0,1);
            const typeSubString = category.categoryType.substring(0,5);
            const categorySku = idSubString.concat(typeSubString);
            category.category_Sku = categorySku;
            await this.categoryRepository.update({
                categoryType:category.categoryType,
                categoryDesc:category.categoryDesc,
                category_Sku :category.category_Sku
            },{where:{
                categoryId:idCategory
              },returning:true
          }).then(results=>{
              res = results;
          })
          return res;
          }
      catch(e){
          throw e;
      }
    }

    async deleteCategorybyId(idCategory):Promise<any>{
        try{
            return await this.categoryRepository.destroy({
                where:{
                    categoryId:idCategory
                }
            })
        }
        catch(e){
            throw e;
        }
    }

    async DeleteCategorybyAdmin(idCategory,imageName):Promise<category>{
        let res;
        try{
            const s3ImageDelete = this.dashboardService.deleteImage(imageName);
            await this.categoryRepository.update({
                deleteInd:'Y'
            },{
                where:{
                    categoryId:idCategory
                }
            })

            return res;
        }
        catch(e){
            throw e;
        }

    }
}
