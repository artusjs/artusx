import {
  ApplicationLifecycle,
  ArtusApplication,
  Inject,
  ArtusInjectEnum,
  LifecycleHookUnit,
  LifecycleHook,
} from '@artus/core';
import { CronJob } from 'cron';

import { CLASS_SCHEDULE_TAG, CLASS_SCHEDULE_METADATA } from './decorator';

import { ArtusXSchedule, ArtusXScheduleHandler, ArtusXScheduleOptions } from './types';

@LifecycleHookUnit()
export default class ScheduleLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  jobs: Map<string, any>;

  get container() {
    return this.app.container;
  }

  constructor() {
    this.jobs = new Map();
  }

  private registerSchedule(id: string, metadata: ArtusXScheduleOptions, handler: ArtusXScheduleHandler) {
    const { enable, cron, start = false, timeZone = 'Asia/Shanghai', runOnInit = false } = metadata;
    if (!enable) {
      return;
    }

    const job = CronJob.from({
      cronTime: cron,
      start,
      runOnInit,
      timeZone,
      onTick: async () => {
        await handler();
      },
    });

    this.jobs.set(id, job);
    job.start();
  }

  private loadSchedule() {
    const scheduleClazzList = this.container.getInjectableByTag(CLASS_SCHEDULE_TAG);

    for (const scheduleClazz of scheduleClazzList) {
      const schedule: ArtusXSchedule = this.container.get(scheduleClazz) as any;
      const scheduleMetadata = Reflect.getMetadata(CLASS_SCHEDULE_METADATA, scheduleClazz);

      this.registerSchedule(scheduleClazz.name, scheduleMetadata, schedule.run.bind(schedule));
    }
  }

  @LifecycleHook()
  async willReady() {
    this.loadSchedule();
  }
}
