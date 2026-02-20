import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './infrastructure';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  @Public()
  index() {
    return this.appService.index();
  }

  @Get('/health')
  @Public()
  health() {
    return 'running';
  }

  @Get('/health/env')
  @Public()
  healthEnv() {
    return this.appService.env();
  }
}
