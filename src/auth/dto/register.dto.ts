import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestRegisterDto {
  @ApiProperty({ default: 'tottee' })
  @IsEmail()
  @IsNotEmpty()
  username: string;
}

export class RegisterDto {
  @ApiProperty({ type: String, default: 'tottee' })
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ default: '123123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
