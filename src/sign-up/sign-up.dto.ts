import { Timestamp } from "rxjs";

export class SignUpDto {
    userName:String;
    email:String;
    mobileNumber:string;
    password:string;
    createdAt?:string;
    updatedAt?:string;
    CustomerType:string;
}
