import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindBlogDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  category: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;
}
