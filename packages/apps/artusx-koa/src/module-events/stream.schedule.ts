import dayjs from 'dayjs';
import { Inject, Schedule } from '@artusx/core';

import EventEmitterService from './eventEmitter.service';
import type { ArtusXSchedule } from '@artusx/core';

@Schedule({
  enable: true,
  cron: '*/5 * * * * *',
  runOnInit: false,
})
export default class StreamSchedule implements ArtusXSchedule {
  @Inject(EventEmitterService)
  eventEmitterService: EventEmitterService;

  async run() {
    this.eventEmitterService.emit('stream', {
      data: `StreamSchedule: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
    });
    console.log('StreamSchedule.run', dayjs().format('YYYY-MM-DD HH:mm:ss'));
  }
}
