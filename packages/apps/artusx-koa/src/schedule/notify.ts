import { Schedule } from '@artusx/core';
import type { ArtusxSchedule } from '@artusx/core';

@Schedule({
  enable: true,
  cron: '30 * * * * *',
  runOnInit: true,
})
export default class NotifySchedule implements ArtusxSchedule {
  async run() {
    console.log('ScheduleTaskClass.run', Date.now());
  }
}
