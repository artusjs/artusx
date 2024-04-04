import fs from 'fs';
import semver from 'semver';
import runScript from 'runscript';
import { Injectable } from '@artus-cli/artus-cli';
import BaseService from './base';

@Injectable()
export default class GitService extends BaseService {
  async getLatestTag(_cwd?: string) {
    const git = await import('isomorphic-git');
    try {
      const tags = await git.listTags({ fs, dir: _cwd });
      tags.sort((a, b) => semver.compare(a, b));
      return tags[tags.length - 1];
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }

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
