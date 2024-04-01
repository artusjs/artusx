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

  async publishPackage(
    packageName: string,
    dir: string,
    _options?: {
      packageName: string;
      registry: string;
      tag: string;
      access: string;
    }
  ) {
    const tagName = this.tag;

    console.log('\n');
    console.log(`[${packageName}]: publishing...`);

    const rushConfiguration = this.rushConfiguration;
    const commonRushConfigFolder = rushConfiguration.commonRushConfigFolder;
    const npmrc = path.join(commonRushConfigFolder, '.npmrc-publish');

    const cmd = ['npm publish', '--userconfig', npmrc, '--tag', _options?.tag || tagName];

    const str = cmd.join(' ');

    try {
      const { stdout } = await runScript(str, {
        stdio: 'pipe',
        shell: false,
        cwd: dir,
      });

      console.log(stdout?.toString());
    } catch (error) {
      const output = error.stdio?.stdout || error.stdio?.stderr || '';
      if (!output) {
        console.error(error);
        return;
      }
      console.error(output.toString());
    }
  }

  async run() {
    await this.initRush();
    const rushConfiguration = this.rushConfiguration;

    for (const project of rushConfiguration.projects) {
      const { packageName, versionPolicyName, shouldPublish, packageJson, publishFolder } = project;

      if (!versionPolicyName || !shouldPublish) {
        console.log('\n');
        console.log(`[${packageName}] skip, undefined version policy / should't publish`);
        continue;
      }

      const targetVersion = await this.getTargetVersion(project.packageName);

      if (packageJson.version === targetVersion) {
        console.log('\n');
        console.log(`[${packageName}@${targetVersion}] skip, same dist-tag / no update`);
        continue;
      }

      await this.publishPackage(packageName, publishFolder);
    }
  }
}
