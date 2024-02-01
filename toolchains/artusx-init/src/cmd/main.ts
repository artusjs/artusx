import fs from 'fs';
import path from 'path';
import json from 'comment-json';
import Init from 'egg-init';
import { DefineCommand, Command, Option } from '@artus-cli/artus-cli';

import { SCOPE_NAME, RUSH_ROOT_PATH, RUSH_CONFIG_PATH, BOILERPLATES } from '../constants';

@DefineCommand()
export class MainCommand extends Command {
  @Option({
    alias: 'n',
    description: 'project name',
    required: true,
  })
  name: string;

  @Option({
    alias: 't',
    default: 'plugins',
    description: 'project type (apps / libs / plugins), default: plugins',
  })
  type: string;

  async generateProject(project: RushProject, boilerplatePath: string) {
    const target = path.join(RUSH_ROOT_PATH, project.projectFolder);
    try {
      await new Init({
        name: `${SCOPE_NAME}`,
      }).run(target, ['--template=' + boilerplatePath]);
    } catch (error) {
      console.error(error.stack);
      process.exit(1);
    }
  }

  async updateRushConfig(project: RushProject) {
    const rushRaw = fs.readFileSync(RUSH_CONFIG_PATH, 'utf-8');
    const rushConfig = json.parse(rushRaw) as unknown as Rush;

    if (!rushConfig) {
      return;
    }

    rushConfig.projects.push(project);

    fs.writeFileSync(RUSH_CONFIG_PATH, json.stringify(rushConfig, null, 2));
  }

  async run() {
    const name = this.name;
    const type = this.type;

    const project: RushProject = {
      packageName: `${SCOPE_NAME}/${name}`,
      projectFolder: `packages/${type}/${name}`,
      tags: [`artusx-${type}`],
      shouldPublish: type !== 'apps' ? true : undefined,
      versionPolicyName: type !== 'apps' ? 'public' : undefined,
    };

    const boilerplate = BOILERPLATES[type];

    await this.generateProject(project, boilerplate);
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
  shouldPublish: boolean | undefined;
  versionPolicyName: 'public' | undefined;
}
