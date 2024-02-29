import fs from 'fs';
import path from 'path';
import json from 'comment-json';
import Init from 'egg-init';
import { DefineCommand, Command, Option } from '@artus-cli/artus-cli';

import {
  PKG_SCOPE_NAME,
  PKG_PREFIX_NAME,
  RUSH_ROOT_PATH,
  RUSH_CONFIG_PATH,
  BOILERPLATES,
  PKG_TYPE_ENUM,
} from '../constants';

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

  @Option({
    alias: 's',
    default: 'remote',
    description: 'remote or local boilerplate, default: remote',
  })
  source: string;

  async generateProject(target: string, params: string[]) {
    try {
      await new Init({
        name: `${PKG_SCOPE_NAME}`,
        configName: '@artusx/init-config',
      }).run(target, params);
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

    const index = rushConfig.projects.findIndex((p) => p.packageName === project.packageName);

    if (index !== -1) {
      console.error(`${project.packageName} already existed. please check your config in rush.json`);
      return;
    }

    rushConfig.projects.push(project);

    fs.writeFileSync(RUSH_CONFIG_PATH, json.stringify(rushConfig, null, 2));
  }

  async run() {
    const cwd = process.cwd();
    const name = this.name;
    const type = this.type;
    const source = this.source;

    let packageName = name;

    if (type == PKG_TYPE_ENUM.App) {
      packageName = `${PKG_PREFIX_NAME}-${name}`;
    }

    if (type == PKG_TYPE_ENUM.Lib) {
      packageName = `${PKG_SCOPE_NAME}/${name}`;
    }

    if (type == PKG_TYPE_ENUM.Plugin) {
      packageName = `${PKG_SCOPE_NAME}/plugin-${name}`;
    }

    if (source === 'local') {
      const project: RushProject = {
        packageName,
        projectFolder: `packages/${type}/${name}`,
        tags: [`artusx-${type}`],
        shouldPublish: type !== 'apps' ? true : undefined,
        versionPolicyName: type !== 'apps' ? 'public' : undefined,
      };

      const target = path.join(RUSH_ROOT_PATH, project.projectFolder);
      const boilerplate = BOILERPLATES[type];
      await this.generateProject(target, ['--template=' + boilerplate]);
      await this.updateRushConfig(project);

      return;
    }

    if (source === 'remote') {
      const target = path.join(cwd, name);

      await this.generateProject(target, [`--type=${type}`]);
      return;
    }
  }
}

interface Rush {
  projects: RushProject[];
}

interface RushProject {
  projectFolder: string;
  packageName?: string;
  tags?: string[];
  shouldPublish?: boolean | undefined;
  versionPolicyName?: 'public' | undefined;
}
