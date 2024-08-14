import { Stock } from "./stock.entity";

export const stockProvider =[{
    provide:'STOCK-REPOSITORY',
    useValue:Stock,
}]