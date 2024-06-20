import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [BlogController],
  providers: [BlogService, JwtService],
})
export class BlogModule {}
