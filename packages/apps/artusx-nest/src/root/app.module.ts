import { Module, DynamicModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaseModule } from './base/base.module';

@Module({})
export class AppModule {
  static registerAsync(options: any): DynamicModule {
    return {
      module: AppModule,
      imports: [BaseModule.register(options)],
      controllers: [AppController],
      providers: [AppService]
    };
  }
}
