import { EventEmitter } from 'events';
import { ArtusApplication, ArtusXInjectEnum, Inject, Injectable, ScopeEnum } from '@artusx/core';

@Injectable({
  scope: ScopeEnum.SINGLETON,
})
export default class EventEmitterService extends EventEmitter {
  @Inject(ArtusXInjectEnum.Application)
  app: ArtusApplication;

  constructor() {
    super();
  }
}

export type EventMessage = {
  data: any;
};
