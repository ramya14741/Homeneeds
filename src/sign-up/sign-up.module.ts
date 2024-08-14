import { Module } from '@nestjs/common';
import { customerProvider } from './sign-up.provider';
import { SignUpService } from './sign-up.service';

@Module({
    providers:[SignUpService,...customerProvider],
    exports:[SignUpService],
})
export class SignUpModule {}
