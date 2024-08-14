import { Injectable, HttpException, HttpStatus, forwardRef, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInService } from '../sign-in/sign-in.service';
import { SignInDto } from '../sign-in/sign-in.dto';
import { TestingModuleBuilder } from '@nestjs/testing';
//import * as dotenv from 'dotenv';
import { cursorTo } from 'readline';
import * as nodemailer from 'nodemailer'
import { config } from 'process';
import { DashboardService } from '../dashboard/dashboard.service';
const xoauth2 = require('xoauth2');
var CryptoJS = require("crypto-js");
//dotenv.config();
// const path = require('path')
// const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../dotenv') })
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioclient = require('twilio')(accountSid, authToken);


@Injectable()
export class AuthService {
    constructor( @Inject(forwardRef(() => SignInService))
    private signInService: SignInService,
    @Inject(forwardRef(() => JwtService))
    private jwtService: JwtService,
        @Inject(forwardRef(() => DashboardService))
    private dashboardService: DashboardService,
    ) {}
    async validateUser(mobileOrEmail, password): Promise<any> {
        try {
            let user;
            await this.signInService.findUser(mobileOrEmail).then(res => {
                user = res;
            })
            if(user){
                const savedDecrypt = CryptoJS.AES.decrypt(user[0].password, process.env.cipher)
                .toString(CryptoJS.enc.Utf8);
            const loginDecrypt = CryptoJS.AES.decrypt(password, process.env.cipher).toString(CryptoJS.enc.Utf8);
            if (user && savedDecrypt == loginDecrypt) {
                return user[0];
            }
            }
            
            return null;
        }
        catch (e) {
            throw e;
        }

    }

    async validateAdmin(mobileorEmail, password): Promise<any> {
        try {
            let user;
            await this.signInService.findAdmin(mobileorEmail).then(res => {
                user = res;
            })
            if (user) {
                const savedDecrypt = CryptoJS.AES.decrypt(user[0].password, process.env.cipher).toString(CryptoJS.enc.Utf8);
                const loginDecrypt = CryptoJS.AES.decrypt(password, process.env.cipher).toString(CryptoJS.enc.Utf8);
                if (user && savedDecrypt == loginDecrypt) {
                    return user[0];
                }
            }
            return user[0]
        }
        catch (e) {
            throw e;
        }
    }

    async validateSuperAdmin(name, password): Promise<any> {
        try {
            let user;
            await this.dashboardService.findAdminbyName(name).then(res => {
                user = res;
            })
            if (user && user[0].AdminType == 'S' ) {
                const savedDecrypt = CryptoJS.AES.decrypt(user[0].AdminPassword, process.env.cipher).toString(CryptoJS.enc.Utf8);
                const loginDecrypt = CryptoJS.AES.decrypt(password, process.env.cipher).toString(CryptoJS.enc.Utf8);
                if (user && savedDecrypt == loginDecrypt) {
                    return user[0];
                }
            }
            return null;
        }
        catch (e) {
            throw e;
        }
    }

    async validateWAdmin(name, password): Promise<any> {
        try {
            let user;
            await this.dashboardService.findAdminbyName(name).then(res => {
                user = res;
            })
            if (user && user[0].AdminType == 'W' ) {
                const savedDecrypt = CryptoJS.AES.decrypt(user[0].AdminPassword, process.env.cipher).toString(CryptoJS.enc.Utf8);
                const loginDecrypt = CryptoJS.AES.decrypt(password, process.env.cipher).toString(CryptoJS.enc.Utf8);
                if (user && savedDecrypt == loginDecrypt) {
                    return user[0];
                }
            }
            return null;
        }
        catch (e) {
            throw e;
        }
    }



    async SandD(name, password): Promise<any> {
        try {
            let user;
            await this.dashboardService.findAdminbyName(name).then(res => {
                user = res;
            })
            if (user && (user[0].AdminType == 'S' || user[0].AdminType == 'D')) {
                const savedDecrypt = CryptoJS.AES.decrypt(user[0].AdminPassword, process.env.cipher).toString(CryptoJS.enc.Utf8);
                const loginDecrypt = CryptoJS.AES.decrypt(password, process.env.cipher).toString(CryptoJS.enc.Utf8);
                if (user && savedDecrypt == loginDecrypt) {
                    return user[0];
                }
            }
            return null;
        }
        catch (e) {
            throw e;
        }
    }

    async SandW(name, password): Promise<any> {
        try {
            let user;
            await this.dashboardService.findAdminbyName(name).then(res => {
                user = res;
            })
            if (user && (user[0].AdminType == 'S' || user[0].AdminType == 'W')) {
                const savedDecrypt = CryptoJS.AES.decrypt(user[0].AdminPassword, process.env.cipher).toString(CryptoJS.enc.Utf8);
                const loginDecrypt = CryptoJS.AES.decrypt(password, process.env.cipher).toString(CryptoJS.enc.Utf8);
                if (user && savedDecrypt == loginDecrypt) {
                    return user[0];
                }
            }
            return null;
        }
        catch (e) {
            throw e;
        }
    }


    async validatedashboardAdmin(username,password):Promise<any>{
        try{
            let admin;
            await this.dashboardService.findAdminbyName(username).then(res=>{
                admin =res;
            })
            if(admin){
                const savedDecrypt = CryptoJS.AES.decrypt(admin[0].AdminPassword, process.env.cipher).toString(CryptoJS.enc.Utf8);
                const loginDecrypt = CryptoJS.AES.decrypt(password, process.env.cipher).toString(CryptoJS.enc.Utf8);
                if (admin && savedDecrypt == loginDecrypt) {
                    return admin[0];
                }
            }
            return null
        }
        catch (e) {
            throw e;
        }
    }

    async login(user) {
        let jwt;
        const payload = { email: user.email, password: user.password };
        jwt = await this.jwtService.sign(payload);
        return jwt;
        // };
    }

    async adminDeliveryLogin(user) {
        let jwt;
        const payload = { email: user.email, password: user.password };
        jwt = await this.jwtService.sign(payload);
        return jwt;
    }

    async adminLogin(admin){
        let jwt;
        const payload ={admin:admin.AdminName, password:admin.AdminPassword};
        jwt = await this.jwtService.sign(payload);
        const res ={
            jwt:jwt,
            role:admin.Role
        }
        return res;
    }

    async sendEmailForgotPassword?(email: string): Promise<boolean> {
        const user = await this.signInService.findUser(email);
        if (!user)
            throw new HttpException({ message: 'user not found' }, HttpStatus.NOT_FOUND)
        const payload = { email: user[0].email, password: user[0].mobileNumber };
        const jwt = await this.jwtService.sign(payload, { expiresIn: '90d' });
        let transporter = nodemailer.createTransport(
            {
                host: process.env.mailhost,
                port: process.env.mailport,
                service: process.env.mailservice,
                auth: {
                    type: process.env.mailtype,
                    user: process.env.mailfrom,
                    clientId: process.env.clientId,
                    clientSecret: process.env.clientsecret,
                    refreshToken: process.env.refreshToken,
                    accessToken: process.env.accessToken
                }
            });
        let mailoptions = {
            type: "login",
            from: 'homeneedstbn@gmail.com',
            to: user[0].email,
            subject: 'Home needs password reset link',
            text: 'verify email',
            html: 'Hi! <br><br> kindly click on below link to reset password<br><br>' +
                '<a href=' + 'http://localhost:3000/customer/resetPassword/jwt?jwt=' + jwt + '>click here to activate your account</a>'
        };
        let mailsend = await new Promise<boolean>(async function (resolve, reject) {
            return await transporter.sendMail(mailoptions, async (error, info) => {
                if (error) {
                    console.log(error);
                    return reject(false);
                }
                return resolve(true);
            });
        })
        return mailsend;
    }

    async sendWelcomeEmail?(email: string): Promise<boolean> {
        const user = await this.signInService.findUser(email);
        if (!user)
            throw new HttpException({ message: 'user not found' }, HttpStatus.NOT_FOUND)
        const payload = { email: user[0].email, password: user[0].mobileNumber };
        const jwt = await this.jwtService.sign(payload, { expiresIn: '90d' });
        let transporter = nodemailer.createTransport(
            {
                host: process.env.mailhost,
                port: process.env.mailport,
                service: process.env.mailservice,
                auth: {
                    type: process.env.mailtype,
                    user: process.env.mailfrom,
                    clientId: process.env.clientId,
                    clientSecret: process.env.clientsecret,
                    refreshToken: process.env.refreshToken,
                    accessToken: process.env.accessToken
                }
            });
        let mailoptions = {
            type: "login",
            from: 'homeneedstbn@gmail.com',
            to: user[0].email,
            subject: 'Welcome to Homeneeds',
            text: 'Welcome Email',
            html: 'Hi! <br><br> You have successfully signed up to homeneeds.Happy Shopping!!<br><br>' 
        };
        let mailsend = await new Promise<boolean>(async function (resolve, reject) {
            return await transporter.sendMail(mailoptions, async (error, info) => {
                if (error) {
                    console.log(error);
                    return reject(false);
                }
                return resolve(true);
            });
        })
        return mailsend;
    }


//     async sendWelcomeSms(mobileNumber):Promise<any>{
// try{
//     let res;
//     twilioclient.messages
//   .create({
//      body: 'You have successfully signed up to homeneeds',
//      from: process.env.twilioNumber,
//      to: '+91'+mobileNumber
//    })
//   .then(message => 
//     res = message).done();
//     return res;
// }
//     catch(e){
//         throw e;
//     }

//     }
}




