import path from 'path';
import { DefineCommand, Command, Option, Inject } from '@artus-cli/artus-cli';

import RushService from '../service/rush';
import InitService from '../service/init';

@DefineCommand()
export class MainCommand extends Command {
  @Inject(RushService)
  rushService: RushService;

  @Inject(InitService)
  initService: InitService;

  @Option({
    alias: 'n',
    description: 'project name',
    required: true,
  })
  name: string;

  @Option({
    alias: 't',
    description: 'project type (apps / libs / plugins), default: plugins',
    default: 'plugins',
    required: true,
  })
  type: string;

  @Option({
    description: 'scope name',
    required: false,
  })
  scopeName: string;

  @Option({
    description: 'config name',
    required: false,
  })
  configName: string;

  @Option({
    description: 'template path',
    required: false,
  })
  template: string;

  @Option({
    description: 'rush project',
    default: false,
    required: false,
  })
  rush: boolean;

  async run() {
    const cwd = process.cwd();
    const name = this.name;
    const type = this.type;
    const template = this.template;

    const params = template ? [`--template=${template}`] : [`--type=${type}`];
    let target = path.join(cwd, name);

    if (this.rush) {
      target = await this.rushService.create(name, type, { cwd });
    }

    await this.initService.create(target, {
      params,
      scopeName: this.scopeName,
      configName: this.configName,
    });
  }
}
