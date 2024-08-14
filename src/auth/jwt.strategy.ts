import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInService } from '../sign-in/sign-in.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { jwtConstants } from './constants';
import { DashboardService } from '../dashboard/dashboard.service';
import { AuthService } from './auth.service';
import e from 'express';
//import {dotenv} from 'dotenv';
 const path = require('path')
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../dotenv') })
const secret = jwtConstants;
//require('dotenv').config({ path: require('find-config')('.env') })
//srequire('dotenv').config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(private signInService: SignInService) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('jwt'),
      ignoreExpiration: false,
      secretOrKey:secret,
    });
  }

  async validate(payload: any):Promise<any> {
    //return { userId: payload.sub, username: payload.username };
     const user = await this.signInService.findUser(payload.email);
     if (!user) {
        throw new UnauthorizedException('You are not authorized to perform the operation');
    }
    return user[0];
  }
}

@Injectable()
export class JwtStrategyUser extends PassportStrategy(Strategy,'User') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:secret,
    });
  }

  async validate(payload: any):Promise<any> {
    //return { userId: payload.sub, username: payload.username };
    const email =payload.email;
    const password = payload.password
      let user;
         await this.authService.validateUser(email, password).then(res=>{
             user =res;
         });
     if (!user) {
        throw new UnauthorizedException('You are not authorized to perform the operation');
    }
    return user;
  }
}

@Injectable()
export class JwtStrategyUandSD extends PassportStrategy(Strategy,'UandSD') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:secret,
    });
  }

  async validate(payload: any):Promise<any> {
    //return { userId: payload.sub, username: payload.username };
    const email =payload.email;
    const password = payload.password
      let user;
      if(email){
        await this.authService.validateUser(email, password).then(res=>{
          user =res;
      });
      }else{
        await this.authService.SandD(payload.admin, payload.password).then(res=>{
          user =res;
      });
      }
       
     if (!user) {
        throw new UnauthorizedException('You are not authorized to perform the operation');
    }
    return user;
  }
}

@Injectable()
export class JwtStrategyUandSW extends PassportStrategy(Strategy,'UandSW') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:secret,
    });
  }

  async validate(payload: any):Promise<any> {
    //return { userId: payload.sub, username: payload.username };
    const email =payload.email;
    const password = payload.password
      let user;
      if(email){
        await this.authService.validateUser(email, password).then(res=>{
          user =res;
      });
      }else{
        await this.authService.SandW(payload.admin, payload.password).then(res=>{
          user =res;
      });
      }
       
     if (!user) {
        throw new UnauthorizedException('You are not authorized to perform the operation');
    }
    return user;
  }
}


@Injectable()
export class JwtStrategyAuth extends PassportStrategy(Strategy,'superAdmin') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:secret,
    });
  }

  async validate(payload: any):Promise<any> {
    //return { userId: payload.sub, username: payload.username };
    const email =payload.email;
    const password = payload.password
      let user;
         await this.authService.validateSuperAdmin(payload.admin, payload.password).then(res=>{
             user =res;
         });
     if (!user) {
        throw new UnauthorizedException('You are not authorized to perform the operation');
    }
    return user;
  }
}

@Injectable()
export class JwtStrategyWAdmin extends PassportStrategy(Strategy,'wAdmin') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:secret,
    });
  }

  async validate(payload: any):Promise<any> {
    //return { userId: payload.sub, username: payload.username };
    const email =payload.email;
    const password = payload.password
      let user;
         await this.authService.validateWAdmin(payload.admin, payload.password).then(res=>{
             user =res;
         });
     if (!user) {
        throw new UnauthorizedException('You are not authorized to perform the operation');
    }
    return user;
  }
}

@Injectable()
export class JwtStrategySandD extends PassportStrategy(Strategy,'SandD') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:secret,
    });
  }

  async validate(payload: any):Promise<any> {
    //return { userId: payload.sub, username: payload.username };
    // const email =payload.email;
    // const password = payload.password
      let user;
         await this.authService.SandD(payload.admin, payload.password).then(res=>{
             user =res;
         });
     if (!user) {
        throw new UnauthorizedException('You are not authorized to perform the operation');
    }
    return user;
  }
}

@Injectable()
export class JwtStrategySandW extends PassportStrategy(Strategy,'SandW') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:secret,
    });
  }

  async validate(payload: any):Promise<any> {
    //return { userId: payload.sub, username: payload.username };
    // const email =payload.email;
    // const password = payload.password
      let user;
         await this.authService.SandW(payload.admin, payload.password).then(res=>{
             user =res;
         });
     if (!user) {
        throw new UnauthorizedException('You are not authorized to perform the operation');
    }
    return user;
  }
}


@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy,'admin') {
  constructor(private dashboardService: DashboardService) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('admin'),
      ignoreExpiration: false,
      secretOrKey:secret,
    });
  }

  async validate(payload: any):Promise<any> {
    //return { userId: payload.sub, username: payload.username };
     const user = await this.dashboardService.findAdminbyName(payload.admin);
     if (!user) {
        throw new UnauthorizedException('You are not authorized to perform the operation');
    }
    return user[0];
  }
}