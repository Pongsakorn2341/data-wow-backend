import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as moment from 'moment';
import { EnvConfigProps } from 'src/common/config/env.config';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvConfigProps>,
  ) {}

  private readonly jwtSecret =
    this.configService.get<string>(`envConfig.JWT_SECRET`);

  private readonly logger = new Logger(AuthService.name);

  async signIn(signInDto: LoginDto) {
    let userData = await this.prismaService.user.findUnique({
      where: {
        username: signInDto.username,
      },
    });
    this.logger.debug(
      `Sign in user data : ${JSON.stringify(userData, null, 2)}`,
      'signIn',
    );
    if (!userData) {
      userData = await this.prismaService.user.create({
        data: {
          username: signInDto.username,
        },
      });
    }
    if (!userData.is_active) {
      throw new HttpException(
        `User is not active or unavailable.`,
        HttpStatus.FORBIDDEN,
      );
    }
    const expiresIn = signInDto.is_remember_me ? '1w' : '6h';
    const signOptions = {
      secret: this.jwtSecret,
      expiresIn: expiresIn,
    } as JwtSignOptions;
    const payload = {
      id: userData.id,
      username: userData.username,
      image: userData.profile_image,
      created_at: userData.created_at,
      role: userData.role,
    };
    const expiresUnit = expiresIn.replace(/\d/g, '');
    const expiresAt = moment()
      .add(expiresIn.replace(expiresUnit, ''), expiresUnit as any)
      .toDate();
    const accessToken = await this.jwtService.sign(payload, signOptions);

    return {
      access_token: accessToken,
      user: payload,
      expires_at: expiresAt,
    };
  }
}
