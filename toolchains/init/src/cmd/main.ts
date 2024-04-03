import path from 'path';
import { DefineCommand, Command, Option, Inject } from '@artus-cli/artus-cli';

import RushService from '../service/rush';
import GeneratorService from '../service/generator';

@DefineCommand()
export class MainCommand extends Command {
  @Inject(RushService)
  rushService: RushService;

  @Inject(GeneratorService)
  generatorService: GeneratorService;

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
    description: 'template path',
    required: false,
  })
  template: boolean;

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
    const rush = this.rush;
    const template = this.template;

    const args = template ? [`--template=${template}`] : [`--type=${type}`];
    let target = path.join(cwd, name);

    if (rush) {
      target = await this.rushService.create(name, type, { cwd });
    }

    await this.generatorService.create(target, args);
  }
}
