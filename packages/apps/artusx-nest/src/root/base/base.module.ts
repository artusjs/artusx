import { DynamicModule, Module } from '@nestjs/common';
import { BaseService } from './base.service';

export const BASE_MODULE_OPTIONS = 'BASE_MODULE_OPTIONS';

export interface BaseModuleOptions {
  container?: any;
}

@Module({})
export class BaseModule {
  static register(options: BaseModuleOptions): DynamicModule {
    return {
      module: BaseModule,
      providers: [
        {
          provide: BASE_MODULE_OPTIONS,
          useValue: options
        },
        BaseService
      ],
      exports: [BaseService]
    };
  }
}
