import Init from 'egg-init';
import { Injectable, Inject, ArtusInjectEnum } from '@artus-cli/artus-cli';

@Injectable()
export default class GeneratorService {
  @Inject(ArtusInjectEnum.Config)
  config: Record<string, any>;

  async create(target: string, params: string[]) {
    const { scopeName, configName } = this.config;

    try {
      await new Init({
        name: scopeName,
        configName,
      }).run(target, params);
    } catch (error) {
      console.error(error.stack);
      process.exit(1);
    }
  }
}
