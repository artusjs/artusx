import runScript from 'runscript';
import * as rushLib from '@microsoft/rush-lib';
import { DefineCommand, Command, Option } from '@artus-cli/artus-cli';
import type { RushConfiguration } from '@microsoft/rush-lib';

@DefineCommand({
  command: 'release',
})
export class ReleaseCommand extends Command {
  rushConfiguration: RushConfiguration;

  @Option({
    alias: 'n',
    description: 'project name',
    required: false,
  })
  name: string;

  @Option({
    alias: 'p',
    description: 'policy name',
    required: false,
    default: 'public',
  })
  policyName: string;

  private async initRush() {
    const baseDir = process.cwd();
    this.rushConfiguration = rushLib.RushConfiguration.loadFromDefaultLocation({
      startingFolder: baseDir,
    });
  }

  async releaseTag(tagName: string, cwd?: string) {
    // # git release v1.0.12 -m "chore: release 1.0.12"

    const tagVersion = `${tagName}`;
    const commitMessage = `"chore: release ${tagName}"`;

    const cmd = ['git release', tagVersion, '-m', commitMessage];

    const str = cmd.join(' ');

    console.log('[release:cmd]', str);

    try {
      const { stdout } = await runScript(str, {
        stdio: 'pipe',
        shell: false,
        cwd,
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

  async getTargetVersion(policyName: string) {
    const rushConfiguration = this.rushConfiguration;
    const versionPolicy = rushConfiguration.versionPolicyConfiguration.getVersionPolicy(policyName);

    if (!versionPolicy) {
      return;
    }

    return versionPolicy?._json['version'];
  }

  async run() {
    await this.initRush();

    const name = this.name;
    const policyName = this.policyName;
    const targetVersion = await this.getTargetVersion(policyName);
    const tagName = name ? `${name}@${targetVersion}` : `v${targetVersion}`;

    console.log('\n');
    console.log(`[release:tag] ${tagName}`);

    await this.releaseTag(tagName);
  }
}
