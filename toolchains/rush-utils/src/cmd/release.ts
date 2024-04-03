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

  get logger() {
    return this.log4jsClient.getLogger();
  }

  async run() {
    await this.rushService.init();

    const name = this.name;
    const version = await this.rushService.getPolicyVersion(this.policyName);
    const tag = name ? `${name}@${version}` : `v${version}`;

    this.logger.info(`[release:tag] ${tag}`);

    await this.gitService.releaseTag(tag);
  }
}
