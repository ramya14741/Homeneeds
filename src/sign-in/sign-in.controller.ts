import {
  Body,
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiHeader,
  ApiHeaders,
  ApiOkResponse,
  ApiParam,
  ApiPropertyOptional,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SignInService } from './sign-in.service';
import { AdminLoginDto, SignInDto } from './sign-in.dto';
//import {ApiImpilicitBody} from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { type } from 'os';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import passport from 'passport';
import { Customer } from '../sign-up/sign-up.entity';
import { SignUpDto } from '../sign-up/sign-up.dto';
import { AdminDto } from '../dashboard/admin.dto';

@ApiTags('sign-in')
@Controller('sign-in')
export class SignInController {
  constructor(
    private SignInService: SignInService,
    private authService: AuthService,
  ) {}
  @Get('findUser/:mobileOrEmail')
  @ApiParam({
    name: 'mobileOrEmail',
    type: String,
    required: true,
  })
  async findUser(@Param('mobileOrEmail') mobileOrEmail: string) {
    try {
      const res = await this.SignInService.findUser(mobileOrEmail);
      if(res == null){
        throw "User doesnt exist"
      }
      return res;
     
    } catch (e) {
      console.log(e);
     // if (e.name == 'SequelizeUniqueConstraintError') {
        throw new HttpException(
          {
            message: e.message||e,
          },
          HttpStatus.BAD_REQUEST,
        );
      // } else {
      //   throw e;
      // }
    }
  }
  @UseGuards(AuthGuard('local'))
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({ description: 'result Token' })
  @Post('/login')
  async login(@Request() req) {
    try{
      return this.authService.login(req.user);
    }catch (e) {
      console.log(e);
     // if (e.name == 'SequelizeUniqueConstraintError') {
        throw new HttpException(
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

  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard("admin"))
  @ApiBody({type:SignInDto})
  @ApiOkResponse({description:'admin token'})
  @Post('/adminDeliveryLogin')
  async adminDeliveryLogin(@Request() req){
    try{
      return this.authService.adminDeliveryLogin(req.user);
    }
    catch(e){
      throw new HttpException({
        message:e.message,
      },
      HttpStatus.BAD_REQUEST)
    }
  }

  @ApiExcludeEndpoint()
@UseGuards(AuthGuard('dashboard'))
@ApiBody({ type: SignInDto })
@ApiOkResponse({ description: 'result Token' })
@Post('/adminlogin')
  async adminlogin(@Request() req) {
    try{
      return this.authService.adminLogin(req.user);
    }catch (e) {
      console.log(e);
     // if (e.name == 'SequelizeUniqueConstraintError') {
        throw new HttpException(
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

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('/profile')
  async getProfile(@Request() req): Promise<any> {
    return req.user;
  }

  
  @Put('forgetPassword/:email')
  @ApiParam({ type: String, name: 'email', required: true })
  async forgetPassword(
    @Param('email') email: string
    //@Body()
  ) {
    try{
      const isEmailSent = await this.authService.sendEmailForgotPassword(email);
      if(isEmailSent){
        return HttpStatus.OK
      }else{
        throw new HttpException({
          message:"error in sending email"
        },HttpStatus.BAD_REQUEST)
    }
  }
    catch(e){
      throw new HttpException({
        message:e
      },HttpStatus.BAD_REQUEST)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({type:String,name:'jwt', required:true})
  @Get('/email/verify/jwt?')
  public async verifyEmail(@Request() req):Promise<any>{
    const payloadreturn ={email:req.user.email,token:req.query.jwt};
    return payloadreturn;
  }

  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('admin'))
  @ApiQuery({type:String,name:'admin', required:true})
  @Get('/email/verifyAdmin/jwt?')
  public async verifyAdmin(@Request() req):Promise<any>{
    const payloadreturn ={AdminName:req.user.AdminName,AdminType:req.user.AdminType,Role:req.user.Role,token:req.query.jwt};
    return payloadreturn;
  }


@UseGuards(AuthGuard('jwt'))
@ApiQuery({type:String,name:'jwt',required:true})
@Put('resetPassword/jwt?')
async updatePassword(@Body() user :SignInDto){
  try{
    return await this.SignInService.updatePassword(user);
  }
catch(e){
  return new HttpException({message:e.message||e},HttpStatus.BAD_GATEWAY);
}
}

}
