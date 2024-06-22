import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as moment from 'moment';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('testSecret'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return an access token and user data when user exists and is active', async () => {
      const loginDto: LoginDto = {
        username: 'testUser',
        is_remember_me: false,
      };
      const userData = {
        id: 'userId',
        username: 'testUser',
        profile_image: 'testImage',
        created_at: new Date(),
        role: 'user',
        is_active: true,
      };
      const token = 'testToken';
      const expiresIn = '6h';
      // const expiresAt = moment().add(6, 'hours').toDate();

      (
        jest.spyOn(prismaService.user, 'findUnique') as jest.Mock
      ).mockResolvedValue(userData);
      (jest.spyOn(jwtService, 'sign') as jest.Mock).mockResolvedValue(token);

      const result = await service.signIn(loginDto);

      expect(result).toEqual({
        access_token: token,
        user: {
          id: userData.id,
          username: userData.username,
          image: userData.profile_image,
          created_at: userData.created_at,
          role: userData.role,
        },
        expires_at: result.expires_at,
      });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: loginDto.username },
      });
      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          id: userData.id,
          username: userData.username,
          image: userData.profile_image,
          created_at: userData.created_at,
          role: userData.role,
        },
        {
          secret: 'testSecret',
          expiresIn: expiresIn,
        },
      );
    });

    it('should create a new user if user does not exist and return an access token and user data', async () => {
      const loginDto: LoginDto = { username: 'newUser', is_remember_me: true };
      const newUser = {
        id: 'newUserId',
        username: 'newUser',
        profile_image: 'newImage',
        created_at: new Date(),
        role: 'user',
        is_active: true,
      };
      const token = 'newTestToken';
      const expiresIn = '1w';
      const expiresAt = moment().add(1, 'week').toDate();

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      (jest.spyOn(prismaService.user, 'create') as jest.Mock).mockResolvedValue(
        newUser,
      );
      (jest.spyOn(jwtService, 'sign') as jest.Mock).mockResolvedValue(token);

      const result = await service.signIn(loginDto);

      expect(result).toEqual({
        access_token: token,
        user: {
          id: newUser.id,
          username: newUser.username,
          image: newUser.profile_image,
          created_at: newUser.created_at,
          role: newUser.role,
        },
        expires_at: result.expires_at,
      });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: loginDto.username },
      });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: { username: loginDto.username },
      });
      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          id: newUser.id,
          username: newUser.username,
          image: newUser.profile_image,
          created_at: newUser.created_at,
          role: newUser.role,
        },
        {
          secret: 'testSecret',
          expiresIn: expiresIn,
        },
      );
    });

    it('should throw an error if user is not active', async () => {
      const loginDto: LoginDto = {
        username: 'inactiveUser',
        is_remember_me: false,
      };
      const inactiveUser = {
        id: 'inactiveUserId',
        username: 'inactiveUser',
        profile_image: 'inactiveImage',
        created_at: new Date(),
        role: 'user',
        is_active: false,
      };

      (
        jest.spyOn(prismaService.user, 'findUnique') as jest.Mock
      ).mockResolvedValue(inactiveUser);

      await expect(service.signIn(loginDto)).rejects.toThrow(
        new HttpException(
          `User is not active or unavailable.`,
          HttpStatus.FORBIDDEN,
        ),
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: loginDto.username },
      });
    });
  });
});
