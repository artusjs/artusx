import fs from 'fs';
import path from 'path';
import json from 'comment-json';
import Init from 'egg-init';
import { DefineCommand, Command, Option } from '@artus-cli/artus-cli';

const ROOT_DIR = path.resolve(__dirname, '../../../..');
const RUSH_CONFIG = path.join(ROOT_DIR, 'rush.json');

@DefineCommand()
export class MainCommand extends Command {
  @Option({
    alias: 'n',
    description: 'plugin name',
    required: true,
  })
  name: string;

  @Option({
    alias: 't',
    default: 'plugin',
    description: 'plugin or application',
  })
  type: string;

  async generateProject(project: RushProject) {
    const target = path.join(ROOT_DIR, project.projectFolder);
    const boilerplatePath = path.join(__dirname, '../../boilerplate/plugin-boilerplate');

    try {
      await new Init({
        name: '@artusx/cli',
      }).run(target, ['--template=' + boilerplatePath, '--silent']);
    } catch (error) {
      console.error(error.stack);
      process.exit(1);
    }
  }

  async updateRushConfig(project: RushProject) {
    const rushRaw = fs.readFileSync(RUSH_CONFIG, 'utf-8');
    const rushConfig = json.parse(rushRaw) as unknown as Rush;

    if (!rushConfig) {
      return;
    }

    rushConfig.projects.push(project);

    fs.writeFileSync(RUSH_CONFIG, json.stringify(rushConfig, null, 2));
  }

  async run() {
    const name = this.name;
    const type = 'plugins';

    const project: RushProject = {
      packageName: `@artusx/${name}`,
      projectFolder: `packages/${type}/${name}`,
      tags: [`artus-${type}`],
      shouldPublish: true,
      versionPolicyName: 'public',
    };

    await this.generateProject(project);
    await this.updateRushConfig(project);
  }
}

interface Rush {
  projects: RushProject[];
}

interface RushProject {
  packageName: string;
  projectFolder: string;
  tags: string[];
  shouldPublish: boolean;
  versionPolicyName: 'public';
}
