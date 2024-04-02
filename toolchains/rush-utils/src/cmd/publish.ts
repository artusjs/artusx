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
    default: 'latest',
  })
  tag: string;

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

    env[userHomeEnvVariable] = publishHomeDir;

    return env;
  }

  async publishPackage(
    dir: string,
    _options?: {
      packageName: string;
      registry: string;
      tag: string;
      access: string;
    }
  ) {
    const tagName = this.tag;
    const rushConfiguration = this.rushConfiguration;

    console.log('\n');
    console.log(`publishing...`);

    const bin = rushConfiguration.packageManagerToolFilename;
    const env = await this.getEnv();

    const cmd = [bin, 'publish', '--no-git-checks', '--tag', _options?.tag || tagName];

    const str = cmd.join(' ');

    console.log(`* exec: ${str}`);

    try {
      const { stdout } = await runScript(str, {
        stdio: 'pipe',
        shell: false,
        cwd: dir,
        env,
      });

      console.log(stdout?.toString());

      console.log('published.');
    } catch (error) {
      const output = error.stdio?.stdout || error.stdio?.stderr || '';
      if (!output) {
        console.error(error);
        return;
      }

      console.log('failed to publish the package.');
      console.error(output.toString());
    }
  }

  async run() {
    await this.initRush();
    const rushConfiguration = this.rushConfiguration;

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
      await this.publishPackage(publishFolder);
    }
  }
}
