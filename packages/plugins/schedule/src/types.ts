import type { CronJobParams, CronOnCompleteCommand } from 'cron';

export interface ArtusXSchedule {
  run: ArtusXScheduleHandler;
}

export type ArtusXScheduleHandler = () => Promise<void>;

export type ArtusXScheduleCronTime = CronJobParams<CronOnCompleteCommand | null, null>['cronTime'];

export interface ArtusXScheduleOptions {
  enable: boolean;
  cron: ArtusXScheduleCronTime;
  start?: boolean;
  timeZone?: string;
  runOnInit?: boolean;
}
