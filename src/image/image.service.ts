import { Catch, Inject, Injectable } from '@nestjs/common';
import { imageDto } from './image.dto';
import { ProductImages } from './image.entity';

@Injectable()
export class ImageService {
    constructor(@Inject('IMAGE_REPOSITORY')
    private imageRepository:typeof ProductImages
    ){}
    async addImage(image:imageDto):Promise<ProductImages>{
      try{
        return await this.imageRepository.create(image)
    
      }
      
    catch(e){
        throw e;
    }
}

    async getProductImages(productid):Promise<ProductImages[]>{
        let res;
        try{
            await this.imageRepository.findAll({
                where:{
                    Product_productId:productid
                }
            }).map(el=>el.get({plain:true}))
            .then(results=>{
                res = results
            })
            return res;
        }
       catch(e){
           throw e;
       }
    }

async getAllImages():Promise<ProductImages[]>{
   let res;
   try{
       await this.imageRepository.findAll()
       .map(el=>el.get({plain:true}))
       .then(results=>{
           res= results;
       })
       return res;
   }
   catch(e){
       return e;
   }
}
}
