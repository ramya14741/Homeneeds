import { Admin } from "./admin.entity";

export const adminProvider =[{
    provide:'ADMIN-REPOSITORY',
    useValue:Admin,
}]