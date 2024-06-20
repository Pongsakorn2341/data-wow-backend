import { Comment } from './../comment/entities/comment.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { FindBlogDto } from './dto/find-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, createBlogDto: CreateBlogDto) {
    const result = await this.prismaService.blog.create({
      data: {
        ...createBlogDto,
        created_by: userId,
      },
    });
    return result;
  }

  async findAll(dto: FindBlogDto) {
    const blogs = await this.prismaService.blog.findMany({
      include: {
        User: true,
        _count: {
          select: {
            Comment: true,
          },
        },
      },
    });
    return blogs;
  }

  async findAllOwn(userId: string, dto: FindBlogDto) {
    const blogs = await this.prismaService.blog.findMany({
      where: {
        created_by: userId,
      },
      include: {
        _count: {
          select: {
            Comment: true,
          },
        },
      },
    });
    return blogs;
  }

  async findOne(userId: string, id: string) {
    const blog = await this.prismaService.blog.findUnique({
      where: {
        created_by: userId,
        id: id,
      },
      include: {
        _count: {
          select: {
            Comment: true,
          },
        },
        User: true,
        Comment: true,
      },
    });
    if (!blog) {
      throw new Error(`Blog is not found`);
    }
    return blog;
  }

  async update(userId: string, id: string, updateBlogDto: UpdateBlogDto) {
    const data = await this.findOne(userId, id);
    const updated = await this.prismaService.blog.update({
      where: {
        id: data.id,
      },
      data: updateBlogDto,
    });
    return data;
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    const deltedData = await this.prismaService.blog.delete({
      where: {
        id: id,
      },
    });
    return deltedData;
  }
}
