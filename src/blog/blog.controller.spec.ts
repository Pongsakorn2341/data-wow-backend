import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { FindBlogDto } from './dto/find-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { IUserJwt } from './../common/decorators/current-user.decorator';
import { EUserRole } from '@prisma/client';

describe('BlogController', () => {
  let controller: BlogController;
  let service: BlogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [
        {
          provide: BlogService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findAllOwn: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BlogController>(BlogController);
    service = module.get<BlogService>(BlogService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a blog', async () => {
      const userId = 'userId';
      const createBlogDto: CreateBlogDto = {
        title: 'title',
        detail: 'detail',
        category: 'category',
      };
      const user: IUserJwt = {
        id: userId,
        username: 'test',
        created_at: '2023-01-01T00:00:00.000Z',
        role: EUserRole.USER,
        iat: 1234567890,
        exp: 1234567890,
      };
      const result = { ...createBlogDto, created_by: userId };

      (jest.spyOn(service, 'create') as jest.Mock).mockResolvedValue(result);

      expect(await controller.create(user, createBlogDto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(userId, createBlogDto);
    });
  });

  describe('findAll', () => {
    it('should return all blogs', async () => {
      const findBlogDto: FindBlogDto = { title: 'title', category: 'category' };
      const result = [
        { title: 'title', detail: 'detail', category: 'category' },
      ];

      (jest.spyOn(service, 'findAll') as jest.Mock).mockResolvedValue(result);

      expect(await controller.findAll(findBlogDto)).toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith(findBlogDto);
    });
  });

  describe('findAllOwns', () => {
    it('should return all blogs of the user', async () => {
      const userId = 'userId';
      const findBlogDto: FindBlogDto = { title: 'title', category: 'category' };
      const user: IUserJwt = {
        id: userId,
        username: 'test',
        created_at: '2023-01-01T00:00:00.000Z',
        role: EUserRole.USER,
        iat: 1234567890,
        exp: 1234567890,
      };
      const result = [
        { title: 'title', detail: 'detail', category: 'category' },
      ];

      (jest.spyOn(service, 'findAllOwn') as jest.Mock).mockResolvedValue(
        result,
      );

      expect(await controller.findAllOwns(user, findBlogDto)).toEqual(result);
      expect(service.findAllOwn).toHaveBeenCalledWith(userId, findBlogDto);
    });
  });

  describe('findOne', () => {
    it('should return a blog', async () => {
      const id = 'id';
      const result = { title: 'title', detail: 'detail', category: 'category' };

      (jest.spyOn(service, 'findOne') as jest.Mock).mockResolvedValue(result);

      expect(await controller.findOne(id)).toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a blog', async () => {
      const userId = 'userId';
      const id = 'id';
      const updateBlogDto: UpdateBlogDto = {
        title: 'updated title',
        detail: 'updated detail',
      };
      const user: IUserJwt = {
        id: userId,
        username: 'test',
        created_at: '2023-01-01T00:00:00.000Z',
        role: EUserRole.USER,
        iat: 1234567890,
        exp: 1234567890,
      };
      const result = { title: 'title', detail: 'detail', category: 'category' };

      (jest.spyOn(service, 'update') as jest.Mock).mockResolvedValue(result);

      expect(await controller.update(user, id, updateBlogDto)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith(userId, id, updateBlogDto);
    });
  });

  describe('remove', () => {
    it('should remove a blog', async () => {
      const userId = 'userId';
      const id = 'id';
      const user: IUserJwt = {
        id: userId,
        username: 'test',
        created_at: '2023-01-01T00:00:00.000Z',
        role: EUserRole.USER,
        iat: 1234567890,
        exp: 1234567890,
      };
      const result = { title: 'title', detail: 'detail', category: 'category' };

      (jest.spyOn(service, 'remove') as jest.Mock).mockResolvedValue(result);

      expect(await controller.remove(user, id)).toEqual(result);
      expect(service.remove).toHaveBeenCalledWith(userId, id);
    });
  });
});
