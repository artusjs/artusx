import Init from 'egg-init';
import { Injectable, Inject, ArtusInjectEnum } from '@artus-cli/artus-cli';

@Injectable()
export default class InitService {
  @Inject(ArtusInjectEnum.Config)
  config: Record<string, any>;

  async create(
    target: string,
    options: {
      scopeName?: string;
      configName?: string;
      params: string[];
    }
  ) {
    try {
      await new Init({
        name: options?.scopeName || this.config.scopeName,
        configName: options?.configName || this.config.configName,
      }).run(target, options?.params || []);
    } catch (error) {
      console.error(error.stack);
      process.exit(1);
    }
  }
}
