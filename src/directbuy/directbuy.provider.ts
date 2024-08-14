import { directBuy } from "./directbuy.entity";

export const directBuyProvider =[{
    provide: 'DIRECTBUY_REPOSITORY',
    useValue: directBuy
}]