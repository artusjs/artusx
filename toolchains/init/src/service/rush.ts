import fs from 'fs';
import path from 'path';
import json from 'comment-json';
import assert from 'assert';
import { Injectable, Inject, ArtusInjectEnum } from '@artus-cli/artus-cli';
import * as rushLib from '@microsoft/rush-lib';
import type { RushConfiguration } from '@microsoft/rush-lib';

import { PKG_TYPE_ENUM } from '../constants';

@Injectable()
export default class RushService {
  rushConfiguration: RushConfiguration;

  @Inject(ArtusInjectEnum.Config)
  config: Record<string, any>;

  async init(baseDir?: string) {
    this.rushConfiguration = rushLib.RushConfiguration.loadFromDefaultLocation({
      startingFolder: baseDir || process.cwd(),
    });
  }

  async genProject(name: string, type: string): Promise<RushProject> {
    const { scopeName, prefixName } = this.config;
    let packageName = name;

    assert(
      [PKG_TYPE_ENUM.App, PKG_TYPE_ENUM.Plugin, PKG_TYPE_ENUM.Lib].includes(type as any),
      'invalid type.'
    );

    if (type == PKG_TYPE_ENUM.App) {
      packageName = `${prefixName}-${name}`;
    }

    if (type == PKG_TYPE_ENUM.Lib) {
      packageName = `${scopeName}/${name}`;
    }

    if (type == PKG_TYPE_ENUM.Plugin) {
      packageName = `${scopeName}/plugin-${name}`;
    }

    return {
      packageName,
      projectFolder: `packages/${type}/${name}`,
      tags: [`artusx-${type}`],
      shouldPublish: type === 'apps' ? false : undefined,
      versionPolicyName: type !== 'apps' ? 'public' : undefined,
    };
  }

  async updateConfig(project: RushProject) {
    const { rushJsonFile, rushJsonFolder, rushConfigurationJson } = this.rushConfiguration;

    assert(rushConfigurationJson, 'config file not found');

    const { packageName, projectFolder } = project;

    const _project = this.rushConfiguration.getProjectByName(packageName);
    assert(!_project, `already existed. please check your config in rush.json`);

    rushConfigurationJson.projects.push(project as any);
    fs.writeFileSync(rushJsonFile, json.stringify(rushConfigurationJson, null, 2));

    return path.join(rushJsonFolder, projectFolder);
  }

  async create(
    name: string,
    type: string,
    _options: {
      cwd: string;
    }
  ): Promise<string> {
    await this.init(_options.cwd);
    const project = await this.genProject(name, type);
    const target = await this.updateConfig(project);
    return target;
  }
}

interface RushProject {
  projectFolder: string;
  packageName: string;
  tags?: string[];
  shouldPublish?: boolean | undefined;
  versionPolicyName?: 'public' | undefined;
}
