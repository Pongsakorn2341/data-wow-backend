import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { IgnoreAuth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { IUserJwt } from './../common/decorators/current-user.decorator';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { FindBlogDto } from './dto/find-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller({
  version: '1',
  path: 'blog',
})
@ApiBearerAuth()
@ApiTags('Blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  create(
    @CurrentUser() userData: IUserJwt,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    return this.blogService.create(userData.id, createBlogDto);
  }

  @Get()
  @IgnoreAuth()
  findAll(@Query() dto: FindBlogDto) {
    return this.blogService.findAll(dto);
  }

  @Get('own')
  findAllOwns(@CurrentUser() userData: IUserJwt, @Query() dto: FindBlogDto) {
    return this.blogService.findAllOwn(userData.id, dto);
  }

  @Get(':id')
  findOne(@CurrentUser() userData: IUserJwt, @Param('id') id: string) {
    return this.blogService.findOne(userData.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() userData: IUserJwt,
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.update(userData.id, id, updateBlogDto);
  }

  @Delete(':id')
  remove(@CurrentUser() userData: IUserJwt, @Param('id') id: string) {
    return this.blogService.remove(userData.id, id);
  }
}
