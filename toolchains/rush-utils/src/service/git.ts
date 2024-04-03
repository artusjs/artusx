import runScript from 'runscript';
import { Injectable } from '@artus-cli/artus-cli';
import BaseService from './base';

@Injectable()
export default class GitService extends BaseService {
  // # git release v1.0.12 -m "chore: release 1.0.12"
  async releaseTag(tagName: string, _cwd?: string) {
    const tagVersion = `${tagName}`;
    const commitMessage = `"chore: release ${tagName}"`;
    const cmd = ['git release', tagVersion, '-m', commitMessage];
    const str = cmd.join(' ');

    this.logger.info('[release:cmd]', str);

    try {
      const { stdout } = await runScript(str, {
        stdio: 'pipe',
        shell: false,
        cwd: _cwd,
      });

      this.logger.info(stdout?.toString());
    } catch (error) {
      const output = error.stdio?.stdout || error.stdio?.stderr || '';
      if (!output) {
        this.logger.error(error);
        return;
      }
      this.logger.error(output.toString());
    }
  }
}
