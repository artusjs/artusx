import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  async getHome(): Promise<string> {
    const message = await this.appService.getHome();
    return message;
  }
}
