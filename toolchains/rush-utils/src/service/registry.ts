import urllib from 'urllib';
import { Injectable } from '@artus-cli/artus-cli';
import BaseService from './base';

@Injectable()
export default class RegistryService extends BaseService {
  async getDistTagVersion(
    packageName: string,
    _options?: {
      registry?: string;
      distTag?: string;
    }
  ) {
    try {
      const { registry = 'https://registry.npmjs.org', distTag = 'latest' } = _options || {};
      const { data } = await urllib.request(`${registry}/${packageName}`, {
        dataType: 'json',
        timeout: 30000,
      });

      const tags = data['dist-tags'] || {};
      return tags[distTag];
    } catch (error) {
      this.logger.error(error);
      return '';
    }
  }
}
