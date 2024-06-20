import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    required: true,
    type: String,
    default: 'tottee',
  })
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ required: false, type: Boolean, default: false })
  @IsBoolean()
  @IsNotEmpty()
  is_remember_me: boolean;
}
