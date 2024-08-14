import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy} from 'passport-local';
import { SignInService } from '../sign-in/sign-in.service';
import { AuthService } from './auth.service';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authService:AuthService){
        super();
    }
    async validate(username:string, password:string):Promise<any>{
        let user;
         await this.authService.validateUser(username, password).then(res=>{
             user =res;
         });
        // if(user == null){
        //     return null;
        // }
        return user;
    }
}

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(Strategy,"admin"){
constructor(private authService:AuthService){super()}
async validate(username:string, password:string):Promise<any>{
    let user;
    await this.authService.validateAdmin(username, password).then(res=>{
        user =res;
    })
    if(!user){
        throw new UnauthorizedException();
    }
    return user;
}
}

@Injectable()
export class LocalDashboardStrategy extends PassportStrategy(Strategy,'dashboard'){
constructor(private authService:AuthService){super()}
async validate(AdminName:string, AdminPassword:string):Promise<any>{
    let user;
    await this.authService.validatedashboardAdmin(AdminName, AdminPassword).then(res=>{
        user =res;
    })
    if(!user){
        throw new UnauthorizedException();
    }
    return user;
}
}