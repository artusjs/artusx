import { Schedule } from '@artusx/core';

@Schedule({
  enable: true,
  cron: '30 * * * * *',
  runOnInit: true,
})
export default class NotifySchedule {
  run() {
    console.log('ScheduleTaskClass.run', Date.now());
  }
}
