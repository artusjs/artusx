import fs from 'fs';
import path from 'path';
import runScript from 'runscript';
import { Injectable, Inject, ArtusInjectEnum } from '@artus-cli/artus-cli';
import * as rushLib from '@microsoft/rush-lib';
import type { RushConfiguration } from '@microsoft/rush-lib';
import BaseService from './base';

@Injectable()
export default class RushService extends BaseService {
  rushConfiguration: RushConfiguration;

  @Inject(ArtusInjectEnum.Config)
  config: Record<string, any>;

  async init(baseDir?: string) {
    this.rushConfiguration = rushLib.RushConfiguration.loadFromDefaultLocation({
      startingFolder: baseDir || process.cwd(),
    });
  }

  async getProjects() {
    return this.rushConfiguration.projects;
  }

  async getEnvironment() {
    const rushConfiguration = this.rushConfiguration;

    const env: Record<string, any> = {
      ...process.env,
    };

    const userHomeEnvVariable: string = process.platform === 'win32' ? 'USERPROFILE' : 'HOME';
    const publishHomeDir = path.join(rushConfiguration.commonTempFolder, 'publish-home');
    const npmConfigFile = path.join(rushConfiguration.commonTempFolder, 'publish-home', '.npmrc');

    if (fs.existsSync(npmConfigFile)) {
      env[userHomeEnvVariable] = publishHomeDir;
      this.logger.info(`[npmrc: config env ${userHomeEnvVariable}]`, publishHomeDir);
    }

    return env;
  }

  async getPolicyVersion(policyName: string) {
    const rushConfiguration = this.rushConfiguration;
    const versionPolicy = rushConfiguration.versionPolicyConfiguration.getVersionPolicy(policyName);

    if (!versionPolicy) {
      return;
    }

    return versionPolicy?._json['version'];
  }

  async publishPackage(
    dir: string,
    _options?: {
      tag?: string;
      access?: string;
      registry?: string;
      packageName?: string;
      environment?: Record<string, any>;
    }
  ) {
    const rushConfiguration = this.rushConfiguration;

    this.logger.info(`publishing...`);

    const bin = rushConfiguration.packageManagerToolFilename;

    const cmd = [bin, 'publish', '--no-git-checks'];

    if (_options?.tag) {
      cmd.push('--tag');
      cmd.push(_options?.tag);
    }

    if (_options?.access) {
      cmd.push('--access');
      cmd.push(_options?.access);
    }

    const str = cmd.join(' ');

    this.logger.info(`* ${str}`);

    try {
      const { stdout } = await runScript(str, {
        stdio: 'pipe',
        shell: false,
        cwd: dir,
        env: _options?.environment,
      });

      this.logger.info(stdout?.toString());

      this.logger.info('published.');
    } catch (error) {
      const output = error.stdio?.stdout || error.stdio?.stderr || '';
      if (!output) {
        this.logger.error(error);
        return;
      }

      this.logger.info('failed to publish the package.');
      this.logger.error(output.toString());
    }
  }
}
