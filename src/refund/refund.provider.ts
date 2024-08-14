import { RefundDetails } from "./refund.entity";

export const refundDetailProvider =[{
    provide:'REFUNDDETAIL-REPOSITORY',
    useValue:RefundDetails
}]