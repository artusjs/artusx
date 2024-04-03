import { DefineCommand, Command, Option, Inject } from '@artus-cli/artus-cli';
import RushService from '../service/rush';
import RegistryService from '../service/registry';
import { Log4jsClient } from '@artusx/plugin-log4js';

@DefineCommand({
  command: 'publish',
})
export class PublishCommand extends Command {
  @Inject(RushService)
  rushService: RushService;

  @Inject(RegistryService)
  registryService: RegistryService;

  @Inject(Log4jsClient)
  log4jsClient: Log4jsClient;

  @Option({
    alias: 'r',
    description: 'npm registry',
    required: false,
    default: 'https://registry.npmjs.org',
  })
  registry: string;

  @Option({
    alias: 'dist_tag',
    description: 'dist tag name (compare version)',
    required: false,
    default: 'latest',
  })
  dist_tag: string;

  @Option({
    alias: 't',
    description: 'dist tag name (publish package)',
    required: false,
  })
  tag: string;

  @Option({
    alias: 'a',
    description: 'access',
    required: false,
  })
  access: string;

  get logger() {
    return this.log4jsClient.getLogger();
  }

  async run() {
    await this.rushService.init();
    const projects = await this.rushService.getProjects();
    const environment = await this.rushService.getEnvironment();

    for (const project of projects) {
      const { packageName, versionPolicyName, shouldPublish, packageJson, publishFolder } = project;

      if (!versionPolicyName || !shouldPublish) {
        this.logger.info(`[${packageName}] Skip, undefined version policy / should't publish`);
        continue;
      }

      const distTagVersion = await this.registryService.getDistTagVersion(project.packageName);

      if (packageJson.version === distTagVersion) {
        this.logger.info(`[${packageName}@${distTagVersion}] Skip, Package exists.`);
        continue;
      }

      this.logger.info(`[${packageName}@${distTagVersion}]`);
      await this.rushService.publishPackage(publishFolder, {
        tag: this.tag,
        access: this.access,
        environment,
      });
    }
  }
}
