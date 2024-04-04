import assert from 'assert';
import semver from 'semver';
import { DefineCommand, Command, Option, Inject } from '@artus-cli/artus-cli';
import { Log4jsClient } from '@artusx/plugin-log4js';
import RushService from '../service/rush';
import GitService from '../service/git';

@DefineCommand({
  command: 'release',
})
export class ReleaseCommand extends Command {
  @Inject(RushService)
  rushService: RushService;

  @Inject(GitService)
  gitService: GitService;

  @Inject(Log4jsClient)
  log4jsClient: Log4jsClient;

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

  @Option({
    alias: 'r',
    description: 'release prerelease version',
    required: false,
    default: false,
  })
  prerelease: boolean;

  get logger() {
    return this.log4jsClient.getLogger();
  }

  async releaseFromGit() {
    const root = await this.rushService.getRoot();
    const tag = await this.gitService.getLatestTag(root);
    const version = semver.parse(tag);

    this.logger.info(`[git:tag] ${tag}`);
    this.logger.info(`[git:version] ${version}`);

    assert(version, 'current version is invalid');

    let [identifierBase, identifierNumber] = [...(version?.prerelease || [])];

    if (!identifierBase) {
      identifierBase = 'beta';
    }

    if (!identifierNumber || typeof identifierNumber !== 'number') {
      identifierNumber = 0;
    } else {
      identifierNumber += 1;
    }

    const identifier = `${identifierBase}.${identifierNumber}`;
    const nextVersion = semver.inc(version, 'prerelease', identifier, false);
    return nextVersion;
  }

  async releaseFromRush() {
    const nextVersion = await this.rushService.getPolicyVersion(this.policyName);
    return nextVersion;
  }

  async run() {
    const name = this.name;
    await this.rushService.init();

    const releaseVersion = this.prerelease ? await this.releaseFromGit() : await this.releaseFromRush();
    this.logger.info(`[release:version] ${releaseVersion}`);

    const releaseTag = name ? `${name}@${releaseVersion}` : `v${releaseVersion}`;
    this.logger.info(`[release:tag] ${releaseTag}`);

    // await this.gitService.releaseTag(releaseTag);
  }
}
