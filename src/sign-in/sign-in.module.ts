import { Module } from '@nestjs/common';
import { SignInService } from './sign-in.service';
import { customerProvider } from '../sign-up/sign-up.provider';

@Module({
    providers:[SignInService,...customerProvider],
    exports:[SignInService],
})
export class SignInModule {}
