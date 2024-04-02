import fs from 'fs';
import path from 'path';
import urllib from 'urllib';
import runScript from 'runscript';
import * as rushLib from '@microsoft/rush-lib';
import { DefineCommand, Command, Option } from '@artus-cli/artus-cli';
import type { RushConfiguration } from '@microsoft/rush-lib';

@DefineCommand({
  command: 'publish',
})
export class PublishCommand extends Command {
  rushConfiguration: RushConfiguration;

  @Option({
    alias: 'r',
    description: 'npm registry',
    required: false,
    default: 'https://registry.npmjs.org',
  })
  registry: string;

  @Option({
    alias: 't',
    description: 'dist tag name',
    required: false,
  })
  tag: string;

  @Option({
    alias: 'a',
    description: 'access',
    required: false,
  })
  access: string;

  private async initRush() {
    const baseDir = process.cwd();
    this.rushConfiguration = rushLib.RushConfiguration.loadFromDefaultLocation({
      startingFolder: baseDir,
    });
  }

  async getTargetVersion(packageName: string) {
    try {
      const tagName = this.tag;
      const { data } = await urllib.request(`${this.registry}/${packageName}`, {
        dataType: 'json',
        timeout: 30000,
      });

      const distTags = data['dist-tags'] || {};
      return distTags[tagName];
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  async getEnv() {
    const rushConfiguration = this.rushConfiguration;

    const env: Record<string, any> = {
      ...process.env,
    };

    const userHomeEnvVariable: string = process.platform === 'win32' ? 'USERPROFILE' : 'HOME';
    const publishHomeDir = path.join(rushConfiguration.commonTempFolder, 'publish-home');
    const npmConfigFile = path.join(rushConfiguration.commonTempFolder, 'publish-home', '.npmrc');

    if (fs.existsSync(npmConfigFile)) {
      env[userHomeEnvVariable] = publishHomeDir;
      console.log(`[npmrc: config env ${userHomeEnvVariable}]`, publishHomeDir);
    }

    return env;
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
    const tagName = this.tag;
    const packageAccess = this.access;
    const rushConfiguration = this.rushConfiguration;

    console.log('\n');
    console.log(`[publish-utils] publishing...`);

    const bin = rushConfiguration.packageManagerToolFilename;

    const cmd = [bin, 'publish', '--no-git-checks'];

    if (_options?.tag || tagName) {
      cmd.push('--access');
      cmd.push(_options?.tag || tagName);
    }

    if (_options?.access || packageAccess) {
      cmd.push('--access');
      cmd.push(_options?.access || packageAccess);
    }

    const str = cmd.join(' ');

    console.log(`[publish-utils] ${str}`);

    try {
      const { stdout } = await runScript(str, {
        stdio: 'pipe',
        shell: false,
        cwd: dir,
        env: _options?.environment,
      });

      console.log(stdout?.toString());

      console.log('[publish-utils] published.');
    } catch (error) {
      const output = error.stdio?.stdout || error.stdio?.stderr || '';
      if (!output) {
        console.error(error);
        return;
      }

      console.log('[publish-utils] failed to publish the package.');
      console.error(output.toString());
    }
  }

  async run() {
    await this.initRush();
    const rushConfiguration = this.rushConfiguration;
    const environment = await this.getEnv();

    for (const project of rushConfiguration.projects) {
      const { packageName, versionPolicyName, shouldPublish, packageJson, publishFolder } = project;

      if (!versionPolicyName || !shouldPublish) {
        console.log(`\r\n[${packageName}] Skip, undefined version policy / should't publish`);
        continue;
      }

      const targetVersion = await this.getTargetVersion(project.packageName);

      if (packageJson.version === targetVersion) {
        console.log(`\r\n[${packageName}@${targetVersion}] Skip, Package exists.`);
        continue;
      }

      console.log(`\r\n[${packageName}@${targetVersion}]`);
      await this.publishPackage(publishFolder, {
        environment,
      });
    }
  }
}
