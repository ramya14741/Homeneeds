import { ProductImages } from "./image.entity";

export const imageProvider =[{
    provide:'IMAGE_REPOSITORY',
    useValue: ProductImages,
}]