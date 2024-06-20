import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  blog_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  detail: string;
}
