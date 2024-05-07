import { Inject } from '@artusx/core';
import { Schedule } from '@artusx/core';
import type { ArtusXSchedule } from '@artusx/core';
import { PluginInjectEnum } from '@artusx/utils';
import { EjsClient } from '@artusx/plugin-ejs';

@Schedule({
  enable: true,
  cron: '30 * * * * *',
  runOnInit: true,
})
export default class NotifySchedule implements ArtusXSchedule {
  @Inject(PluginInjectEnum.EJS)
  ejs: EjsClient;

  async run() {
    const data = await this.ejs.render('people.ejs', {
      people: ['geddy', 'neil', 'alex'],
      name: 'hello world',
      layout: false,
    });

    console.log('NotifySchedule.run', data);
  }
}
