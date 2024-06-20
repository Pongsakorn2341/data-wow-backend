import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IgnoreAuth } from './common/decorators/auth.decorator';

@Controller()
@IgnoreAuth()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
