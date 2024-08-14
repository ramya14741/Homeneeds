import { category } from "./category.entity";

export const categoryProvider =[{
    provide:'CATEGORY-REPOSITORY',
    useValue:category
}]