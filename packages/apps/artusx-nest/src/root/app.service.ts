import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from './base/base.service';

@Injectable()
export class AppService {
  @Inject(BaseService)
  baseService: BaseService;

  async getHome(): Promise<string> {
    const message = await this.baseService.getWelcomeMessage();
    return message;
  }
}
