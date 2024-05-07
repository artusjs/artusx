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
  schedules: Map<
    string,
    {
      metadata: ArtusXScheduleOptions;
      handler: ArtusXScheduleHandler;
    }
  >;

  get container() {
    return this.app.container;
  }

  constructor() {
    this.jobs = new Map();
    this.schedules = new Map();
  }

  private registerSchedule(id: string, metadata: ArtusXScheduleOptions, handler: ArtusXScheduleHandler) {
    this.schedules.set(id, { metadata, handler });
  }

  private startSchedules() {
    const ids = this.schedules.keys() || [];

    for (const id of ids) {
      const schedule = this.schedules.get(id);

      if (!schedule) {
        continue;
      }

      const { metadata, handler } = schedule;

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

  @LifecycleHook()
  async didReady() {
    this.startSchedules();
  }
}
