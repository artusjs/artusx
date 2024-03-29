import { Schedule } from '@artusx/core';
import type { ArtusXSchedule } from '@artusx/core';

@Schedule({
  enable: true,
  cron: '30 * * * * *',
  runOnInit: true,
})
export default class NotifySchedule implements ArtusXSchedule {
  async run() {
    console.log('ScheduleTaskClass.run', Date.now());
  }
}
