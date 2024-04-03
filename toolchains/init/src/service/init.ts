import Init from 'egg-init';
import { Injectable, Inject, ArtusInjectEnum } from '@artus-cli/artus-cli';

@Injectable()
export default class InitService {
  @Inject(ArtusInjectEnum.Config)
  config: Record<string, any>;

  async create(target: string, options: Options) {
    const params = options?.params || [];
    const name = options?.scopeName || this.config.scopeName;
    const configName = options?.configName || this.config.configName;

    const registry = this.config.registry;

    if (registry) {
      params.push(`--registry=${registry}`);
    }

    try {
      await new Init({ name, configName }).run(target, params);
    } catch (error) {
      console.error(error.stack);
      process.exit(1);
    }
  }
}

interface Options {
  scopeName?: string;
  configName?: string;
  params: string[];
}
