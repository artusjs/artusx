import type { CronJobParams, CronOnCompleteCommand } from 'cron';

export interface ArtusxSchedule {
  run: ArtusxScheduleHandler;
}

export type ArtusxScheduleHandler = () => Promise<void>;

export type ArtusxScheduleCronTime = CronJobParams<CronOnCompleteCommand | null, null>['cronTime'];

export interface ArtusxScheduleOptions {
  enable: boolean;
  cron: ArtusxScheduleCronTime;
  start?: boolean;
  timeZone?: string;
  runOnInit?: boolean;
}
