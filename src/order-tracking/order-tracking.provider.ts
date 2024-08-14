import { orderTracking } from "./order-tracking.entity";

export const orderTrackingProvider =[{
    provide:'ORDERTRACKING-REPOSITORY',
    useValue:orderTracking
}]