import { Body, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { SignUpDto } from './sign-up.dto';
import { SignUpService } from './sign-up.service';

@ApiTags('sign-up')
@Controller('sign-up')
export class SignUpController {
    constructor(private signUpService: SignUpService,
      private authService: AuthService){}
    @Get('findAllCustomer')
    async findAllCustomer(){
        try{
            return await this.signUpService.findAllCustomer();
        }
        catch (e) {
            console.log(e);
            //if (e.name == 'SequelizeUniqueConstraintError') {
              return new HttpException(
                {
                  message: e.message,
                },
                HttpStatus.BAD_REQUEST,
              );
            // } else {
            //   throw e;
            // }
        }
    }

    @Get('findCustomer/:mobileNumberorEmail')
    @ApiParam({type:String, name:'mobileNumberorEmail',required:true})
    async findCustomer(@Param('mobileNumberorEmail') mobileNumberorEmail:string){
        try{
            return await this.signUpService.findCustomer(mobileNumberorEmail);
        }
        catch (e) {
            console.log(e);
            //if (e.name == 'SequelizeUniqueConstraintError') {
              return new HttpException(
                {
                  message: e.message,
                },
                HttpStatus.BAD_REQUEST,
              );
            // } else {
            //   throw e;
            // }
        }
    }
    @Post('signup')
    @ApiBody({type:SignUpDto, required:true})
    async signUp(@Body() user){
        try{
          const existingUser = await this.signUpService.findCustomer(user.mobileNumber || user.email);
          console.log('existingUser' , existingUser);
              if (existingUser.length>0) {
                  throw 'user already exist';
              }
              if (existingUser.length = 0) {
                throw 'User Not found';
            }
            const res =  await this.signUpService.createUser(user);
            // if(res){
            //   const sendWelcomeEmail = await this.authService.sendWelcomeEmail(user.email);
            // }
            // if(user.mobileNumber){
            //   const sendWelcomeSms = await this.authService.sendWelcomeSms(user.mobileNumber);
            // }
            console.log(res);
            return res;
        }
        catch(e){
            console.log(e.message);
            // if(e.name == 'SequelizeUniqueConstraintError')
            // {
                throw new HttpException({
                    message: 'username or email already exist'
                  }, HttpStatus.BAD_REQUEST);
        //     }
        //     else{throw e}
            
        // }
    }
  }
}
