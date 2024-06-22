import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentService } from './comment.service';

describe('CommentService', () => {
  let service: CommentService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: PrismaService,
          useValue: {
            comment: {
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

    service = module.get<CommentService>(CommentService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a comment', async () => {
      const userId = 'userId';
      const createCommentDto: CreateCommentDto = {
        detail: 'comment detail',
        blog_id: 'blogId',
      };
      const result = { ...createCommentDto, created_by: userId };

      (
        jest.spyOn(prismaService.comment, 'create') as jest.Mock
      ).mockResolvedValue(result);

      expect(await service.create(userId, createCommentDto)).toEqual(result);
      expect(prismaService.comment.create).toHaveBeenCalledWith({
        data: {
          ...createCommentDto,
          created_by: userId,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all comments for a blog', async () => {
      const blogId = 'blogId';
      const result = [{ detail: 'comment detail', blog_id: blogId }];

      (
        jest.spyOn(prismaService.comment, 'findMany') as jest.Mock
      ).mockResolvedValue(result);

      expect(await service.findAll(blogId)).toEqual(result);
      expect(prismaService.comment.findMany).toHaveBeenCalledWith({
        where: {
          blog_id: blogId,
        },
        include: {
          User: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    });
  });

  describe('update', () => {
    it('should update a comment', async () => {
      const userId = 'userId';
      const commentId = 'commentId';
      const updateCommentDto: UpdateCommentDto = {
        detail: 'updated comment detail',
      };
      const commentData = {
        id: commentId,
        detail: 'old detail',
        created_by: userId,
      };

      (
        jest.spyOn(prismaService.comment, 'findUnique') as jest.Mock
      ).mockResolvedValue(commentData);
      (
        jest.spyOn(prismaService.comment, 'update') as jest.Mock
      ).mockResolvedValue({ ...commentData, detail: updateCommentDto.detail });

      expect(await service.update(userId, commentId, updateCommentDto)).toEqual(
        { ...commentData, detail: updateCommentDto.detail },
      );
      expect(prismaService.comment.update).toHaveBeenCalledWith({
        where: {
          id: commentData.id,
        },
        data: {
          detail: updateCommentDto.detail,
        },
      });
    });

    it('should throw an error if comment is not found', async () => {
      const userId = 'userId';
      const commentId = 'commentId';
      const updateCommentDto: UpdateCommentDto = {
        detail: 'updated comment detail',
      };

      jest.spyOn(prismaService.comment, 'findUnique').mockResolvedValue(null);

      await expect(
        service.update(userId, commentId, updateCommentDto),
      ).rejects.toThrow(new Error(`Comment is not found`));
    });
  });

  describe('remove', () => {
    it('should remove a comment', async () => {
      const userId = 'userId';
      const commentId = 'commentId';
      const commentData = {
        id: commentId,
        detail: 'comment detail',
        created_by: userId,
      };

      (
        jest.spyOn(prismaService.comment, 'findUnique') as jest.Mock
      ).mockResolvedValue(commentData);
      (
        jest.spyOn(prismaService.comment, 'delete') as jest.Mock
      ).mockResolvedValue(commentData);

      expect(await service.remove(userId, commentId)).toEqual(commentData);
      expect(prismaService.comment.delete).toHaveBeenCalledWith({
        where: {
          id: commentData.id,
        },
      });
    });

    it('should throw an error if comment is not found', async () => {
      const userId = 'userId';
      const commentId = 'commentId';

      jest.spyOn(prismaService.comment, 'findUnique').mockResolvedValue(null);

      await expect(service.remove(userId, commentId)).rejects.toThrow(
        new Error(`Comment is not found`),
      );
    });
  });
});
