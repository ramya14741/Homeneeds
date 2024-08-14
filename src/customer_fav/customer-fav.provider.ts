import { customerfav } from "./customer-fav.entity";

export const customerFavProvider =[{
    provide:'CUSTOMERFAV-REPOSITORY',
    useValue:customerfav,
}]