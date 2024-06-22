import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { FindBlogDto } from './dto/find-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

describe('BlogService', () => {
  let service: BlogService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        {
          provide: PrismaService,
          useValue: {
            blog: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a blog', async () => {
      const userId = 'userId';
      const createBlogDto: CreateBlogDto = {
        title: 'title',
        detail: 'content',
        category: 'category',
      };
      (prismaService.blog.create as jest.Mock).mockResolvedValue(createBlogDto);

      expect(await service.create(userId, createBlogDto)).toEqual(
        createBlogDto,
      );
      expect(prismaService.blog.create).toHaveBeenCalledWith({
        data: {
          ...createBlogDto,
          created_by: userId,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all blogs', async () => {
      const findBlogDto: FindBlogDto = { title: 'title', category: 'category' };
      const blogArray = [
        { title: 'title', content: 'content', category: 'category' },
      ];
      (prismaService.blog.findMany as jest.Mock).mockResolvedValue(blogArray);

      expect(await service.findAll(findBlogDto)).toEqual(blogArray);
      expect(prismaService.blog.findMany).toHaveBeenCalledWith({
        where: {
          title: { contains: 'title' },
          category: { equals: 'category' },
        },
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
    });
  });

  describe('findAllOwn', () => {
    it('should return all blogs of the user', async () => {
      const userId = 'userId';
      const findBlogDto: FindBlogDto = { title: 'title', category: 'category' };
      const blogArray = [
        { title: 'title', content: 'content', category: 'category' },
      ];
      (prismaService.blog.findMany as jest.Mock).mockResolvedValue(blogArray);

      expect(await service.findAllOwn(userId, findBlogDto)).toEqual(blogArray);
      expect(prismaService.blog.findMany).toHaveBeenCalledWith({
        where: {
          created_by: userId,
        },
        include: {
          _count: {
            select: {
              Comment: true,
            },
          },
          User: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a blog', async () => {
      const id = 'id';
      const blog = { title: 'title', content: 'content', category: 'category' };
      (prismaService.blog.findUnique as jest.Mock).mockResolvedValue(blog);

      expect(await service.findOne(id)).toEqual(blog);
      expect(prismaService.blog.findUnique).toHaveBeenCalledWith({
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
    });

    it('should throw an error if blog is not found', async () => {
      const id = 'id';
      (prismaService.blog.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(
        new HttpException(`Blog is not found`, HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('update', () => {
    it('should update a blog', async () => {
      const userId = 'userId';
      const id = 'id';
      const updateBlogDto: UpdateBlogDto = {
        title: 'updated title',
        detail: 'updated content',
      };
      const blog = { title: 'title', content: 'content', category: 'category' };
      (prismaService.blog.findUnique as jest.Mock).mockResolvedValue(blog);
      (prismaService.blog.update as jest.Mock).mockResolvedValue({
        ...blog,
        ...updateBlogDto,
      });

      expect(await service.update(userId, id, updateBlogDto)).toEqual(blog);
      expect(prismaService.blog.findUnique).toHaveBeenCalledWith({
        where: {
          created_by: userId,
          id: id,
        },
      });
      // expect(prismaService.blog.update).toHaveBeenCalledWith({
      //   where: {
      //     id: blog.id,
      //   },
      //   data: updateBlogDto,
      // });
    });

    it('should throw an error if blog is not found', async () => {
      const userId = 'userId';
      const id = 'id';
      const updateBlogDto: UpdateBlogDto = {
        title: 'updated title',
        detail: 'updated content',
      };
      (prismaService.blog.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update(userId, id, updateBlogDto)).rejects.toThrow(
        new HttpException(`Blog is not found`, HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('remove', () => {
    it('should remove a blog', async () => {
      const userId = 'userId';
      const id = 'id';
      const blog = { title: 'title', content: 'content', category: 'category' };
      (prismaService.blog.findUnique as jest.Mock).mockResolvedValue(blog);
      (prismaService.blog.delete as jest.Mock).mockResolvedValue(blog);

      expect(await service.remove(userId, id)).toEqual(blog);
      expect(prismaService.blog.findUnique).toHaveBeenCalledWith({
        where: {
          created_by: userId,
          id: id,
        },
      });
      expect(prismaService.blog.delete).toHaveBeenCalledWith({
        where: {
          id: id,
        },
      });
    });

    it('should throw an error if blog is not found', async () => {
      const userId = 'userId';
      const id = 'id';
      (prismaService.blog.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(userId, id)).rejects.toThrow(
        new HttpException(`Blog is not found`, HttpStatus.BAD_REQUEST),
      );
    });
  });
});
