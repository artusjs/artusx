import { Container } from '@artus/core';
import { Inject, Injectable } from '@nestjs/common';
import { BASE_MODULE_OPTIONS, BaseModuleOptions } from './base.module';
import InfoService from '../../service/info';

@Injectable()
export class BaseService {
  container: Container;

  constructor(@Inject(BASE_MODULE_OPTIONS) options: BaseModuleOptions) {
    this.container = options.container;
  }

  async getWelcomeMessage(): Promise<string> {
    const infoService = this.container.get(InfoService) as InfoService;
    return infoService.getName();
  }
}
