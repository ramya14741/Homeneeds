//import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty()
  readonly username: string;
  @ApiProperty()
  readonly password: string;
}

export class AdminLoginDto {
  @ApiProperty()
  readonly AdminName: string;
  @ApiProperty()
  readonly AdminPassword: string;
}