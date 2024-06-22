import { Test, TestingModule } from '@nestjs/testing';
import { EUserRole } from '@prisma/client';
import { IUserJwt } from 'src/common/decorators/current-user.decorator';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

describe('CommentController', () => {
  let controller: CommentController;
  let service: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommentController>(CommentController);
    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a comment', async () => {
      const userId = 'userId';
      const createCommentDto: CreateCommentDto = {
        detail: 'comment detail',
        blog_id: 'blogId',
      };
      const user: IUserJwt = {
        id: userId,
        username: 'test',
        created_at: '2023-01-01T00:00:00.000Z',
        role: EUserRole.USER,
        iat: 1234567890,
        exp: 1234567890,
      };
      const result = { ...createCommentDto, created_by: userId };

      (jest.spyOn(service, 'create') as jest.Mock).mockResolvedValue(result);

      expect(await controller.create(user, createCommentDto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(userId, createCommentDto);
    });
  });

  describe('findAll', () => {
    it('should return all comments for a blog', async () => {
      const blogId = 'blogId';
      const result = [{ detail: 'comment detail', blog_id: blogId }];

      (jest.spyOn(service, 'findAll') as jest.Mock).mockResolvedValue(result);

      expect(await controller.findAll(blogId)).toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith(blogId);
    });
  });

  describe('update', () => {
    it('should update a comment', async () => {
      const userId = 'userId';
      const commentId = 'commentId';
      const updateCommentDto: UpdateCommentDto = {
        detail: 'updated comment detail',
      };
      const user: IUserJwt = {
        id: userId,
        username: 'test',
        created_at: '2023-01-01T00:00:00.000Z',
        role: EUserRole.USER,
        iat: 1234567890,
        exp: 1234567890,
      };
      const result = {
        id: commentId,
        detail: 'updated comment detail',
        created_by: userId,
      };

      (jest.spyOn(service, 'update') as jest.Mock).mockResolvedValue(result);

      expect(
        await controller.update(commentId, user, updateCommentDto),
      ).toEqual(result);
      expect(service.update).toHaveBeenCalledWith(
        userId,
        commentId,
        updateCommentDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a comment', async () => {
      const userId = 'userId';
      const commentId = 'commentId';
      const user: IUserJwt = {
        id: userId,
        username: 'test',
        created_at: '2023-01-01T00:00:00.000Z',
        role: EUserRole.USER,
        iat: 1234567890,
        exp: 1234567890,
      };
      const result = {
        id: commentId,
        detail: 'comment detail',
        created_by: userId,
      };

      (jest.spyOn(service, 'remove') as jest.Mock).mockResolvedValue(result);

      expect(await controller.remove(commentId, user)).toEqual(result);
      expect(service.remove).toHaveBeenCalledWith(userId, commentId);
    });
  });
});
