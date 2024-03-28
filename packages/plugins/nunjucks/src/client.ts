import { Injectable, ScopeEnum } from '@artus/core';
import { ArtusXInjectEnum } from './constants';
import nunjucks, {
  ConfigureOptions,
  Template as NunjucksTemplate,
  TemplateCallback as NunjucksTemplateCallback,
  Environment as NunjucksEnvironment,
} from 'nunjucks';

@Injectable({
  id: ArtusXInjectEnum.Nunjucks,
  scope: ScopeEnum.SINGLETON,
})
export default class NunjucksClient {
  private nunjucks: NunjucksEnvironment;

  async init(config: NunjucksConfigureOptions) {
    if (!config) {
      return;
    }

    this.nunjucks = nunjucks.configure(config.path, config?.options || {});
  }

  getClient() {
    return this.nunjucks;
  }

  compile(
    template: string,
    env?: NunjucksEnvironment | undefined,
    callback?: NunjucksTemplateCallback<NunjucksTemplate>
  ) {
    return nunjucks.compile(template, env, callback);
  }

  render(template: string, context: Record<string, any>) {
    return this.nunjucks.render(template, context);
  }

  renderString(template: string, context: Record<string, any>) {
    return this.nunjucks.renderString(template, context);
  }
}

type NunjucksConfigureOptions = {
  path: string;
  options?: ConfigureOptions;
};

export {
  NunjucksClient,
  NunjucksConfigureOptions,
  NunjucksTemplate,
  NunjucksTemplateCallback,
  NunjucksEnvironment,
};
