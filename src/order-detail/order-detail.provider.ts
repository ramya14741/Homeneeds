import { OrderDetails } from "./order-detail.entity";

export const orderDetailProvider =[{
    provide:'ORDERDETAIL-REPOSITORY',
    useValue:OrderDetails
}]