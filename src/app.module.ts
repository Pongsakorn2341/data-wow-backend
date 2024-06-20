import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, HttpAdapterHost } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { envConfigObject, EnvConfigProps } from './common/config/env.config';
import { JoiValidation } from './common/config/env.validation';
import { AuthGuard } from './common/guard/auth.guard';
import { PrismaModule } from './prisma/prisma.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfigObject],
      cache: true,
      isGlobal: true,
      validationSchema: JoiValidation,
      validationOptions: {
        abortEarly: false,
        debug: true,
        stack: true,
      },
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<EnvConfigProps>) => {
        return {
          global: true,
          secret: configService.get<string>('envConfig.JWT_SECRET'),
        };
      },
      inject: [ConfigService],
    }),
    BlogModule,
    AuthModule,
    PrismaModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpAdapterHost,
    },
  ],
})
export class AppModule {}
