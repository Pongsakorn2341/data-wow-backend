import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
    const blogWhereCause: Prisma.BlogWhereInput = {};
    if (dto.title) {
      blogWhereCause.title = {
        contains: dto.title,
      };
    }
    if (dto.category) {
      blogWhereCause.category = {
        equals: dto.category,
      };
    }

    const blogs = await this.prismaService.blog.findMany({
      where: blogWhereCause,
      include: {
        User: true,
        _count: {
          select: {
            Comment: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
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
      orderBy: {
        created_at: 'desc',
      },
    });
    return blogs;
  }

  async findOne(id: string) {
    const blog = await this.prismaService.blog.findUnique({
      where: {
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
      throw new HttpException(`Blog is not found`, HttpStatus.BAD_REQUEST);
    }
    return blog;
  }

  async update(userId: string, id: string, updateBlogDto: UpdateBlogDto) {
    const data = await this.prismaService.blog.findUnique({
      where: {
        created_by: userId,
        id: id,
      },
    });
    if (!data) {
      throw new HttpException(`Blog is not found`, HttpStatus.BAD_REQUEST);
    }
    const updated = await this.prismaService.blog.update({
      where: {
        id: data.id,
      },
      data: updateBlogDto,
    });
    return data;
  }

  async remove(userId: string, id: string) {
    const _data = await this.prismaService.blog.findUnique({
      where: {
        created_by: userId,
        id: id,
      },
    });
    if (!_data) {
      throw new HttpException(`Blog is not found`, HttpStatus.BAD_REQUEST);
    }
    const deltedData = await this.prismaService.blog.delete({
      where: {
        id: id,
      },
    });
    return deltedData;
  }
}
