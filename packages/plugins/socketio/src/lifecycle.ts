import {
  ApplicationLifecycle,
  ArtusApplication,
  Inject,
  ArtusInjectEnum,
  LifecycleHookUnit,
  LifecycleHook,
} from '@artus/core';

import { InjectEnum } from './constants';
import { SocketIOServer } from './server';
import { EventMetadata, NamespaceEvent, NamespaceMetadata } from './types';
import { CLASS_NAMESPACE_METADATA, CLASS_NAMESPACE_TAG, EVENT_METADATA } from './decorator';

@LifecycleHookUnit()
export default class PluginLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @Inject(InjectEnum.SocketIO)
  io: SocketIOServer;

  get container() {
    return this.app.container;
  }

  private registerNsp(nspMetadata: NamespaceMetadata, eventList: NamespaceEvent[]) {
    const io = this.io;
    io.of(nspMetadata.name).on('connection', (socket) => {
      for (const event of eventList) {
        const { eventMetadata, handler } = event;

        socket.on(eventMetadata.name, (msg: any) => {
          handler(msg);
        });
      }
    });
  }

  private loadNamespace() {
    const nspClazzList = this.container.getInjectableByTag(CLASS_NAMESPACE_TAG);
    for (const nspClazz of nspClazzList) {
      const nsp = this.container.get(nspClazz) as any;
      const nspMetadata = Reflect.getMetadata(CLASS_NAMESPACE_METADATA, nspClazz);
      const nspDescriptorList = Object.getOwnPropertyDescriptors(nspClazz.prototype);

      const eventList: NamespaceEvent[] = [];

      for (const key of Object.keys(nspDescriptorList)) {
        const nspDescriptor = nspDescriptorList[key];

        // skip getter/setter
        if (!nspDescriptor.value) {
          continue;
        }

        const eventMetadata: EventMetadata = Reflect.getMetadata(EVENT_METADATA, nspDescriptor.value);

        // skip constructor
        if (!eventMetadata) {
          continue;
        }

        eventList.push({
          eventMetadata,
          handler: nsp[key].bind(nsp),
        });
      }

      this.registerNsp(nspMetadata, eventList);
    }
  }

  @LifecycleHook()
  async willReady() {
    this.loadNamespace();
  }
}
