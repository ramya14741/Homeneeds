import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInModule } from '../sign-in/sign-in.module';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { LocalStrategy,LocalAdminStrategy,LocalDashboardStrategy, } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
//import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy,AdminStrategy, JwtStrategyAuth,JwtStrategySandD,JwtStrategyWAdmin, JwtStrategySandW, JwtStrategyUser, JwtStrategyUandSD,JwtStrategyUandSW} from './jwt.strategy';
import { RazorpayModule } from 'nestjs-razorpay';
import { razorPayProvider } from './auth.provider';
import { OrderTrackingService } from '../order-tracking/order-tracking.service';
import { orderTrackingProvider } from '../order-tracking/order-tracking.provider';
import { DashboardService } from '../dashboard/dashboard.service';
import { adminProvider } from '../dashboard/admin.provider';
import { PaymentService } from './payment';
import { CategoryService } from '../category/category.service';
import { categoryProvider } from '../category/category.provider';
import { offerProvider } from '../offer/offer.provider';
import { OfferService } from '../offer/offer.service';
//dotenv.config();
const path = require('path')
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../dotenv') })

@Module({
  imports:[SignInModule, PassportModule,ConfigModule,
  JwtModule.register({
    secret:dotenv.secret,
    signOptions:{expiresIn:'90d'},
  })
  // RazorpayModule.forRoot({
  //   key_id:process.env.rpaykeyid,
  //   key_secret:process.env.rpaysecretid
  // }),
  // RazorpayModule.register({
  //   key_id: process.env.rpaykeyid,
  //   key_secret: process.env.rpaysecretid
  // }),
  ],
  exports:[AuthService],
  providers: [JwtStrategyUandSD,JwtStrategyUandSW,JwtStrategyUser,JwtStrategySandW,JwtStrategyWAdmin,JwtStrategySandD,JwtStrategyAuth,...offerProvider,OfferService,PaymentService,CategoryService,...categoryProvider,DashboardService,...adminProvider,...orderTrackingProvider,OrderTrackingService,AuthService, LocalStrategy,LocalAdminStrategy,AdminStrategy,LocalDashboardStrategy, JwtStrategy,...razorPayProvider]
})
export class AuthModule {}
