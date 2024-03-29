import { addTag, Injectable, ScopeEnum } from '@artus/core';

export const CLASS_SCHEDULE_TAG = 'CLASS_SCHEDULE_TAG';
export const CLASS_SCHEDULE_METADATA = Symbol.for('CLASS_SCHEDULE_METADATA');

import { ArtusXScheduleOptions } from './types';

/**
 * Schedule decorator
 * @param options ScheduleOptions
 * @example @Schedule()
 * @returns void
 */
export function Schedule(options: ArtusXScheduleOptions) {
  return (target: any) => {
    const scheduleMetadata = options;

    Reflect.defineMetadata(CLASS_SCHEDULE_METADATA, scheduleMetadata, target);
    addTag(CLASS_SCHEDULE_TAG, target);
    Injectable({ scope: ScopeEnum.EXECUTION })(target);
  };
}
