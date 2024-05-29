import { PluginInjectEnum } from '@artusx/utils';

import {
  ApplicationLifecycle,
  ArtusApplication,
  Inject,
  ArtusInjectEnum,
  LifecycleHookUnit,
  LifecycleHook,
} from '@artusx/core';

import { SocketIOServer } from '@artusx/plugin-socketio';

@LifecycleHookUnit()
export default class PluginLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @Inject(PluginInjectEnum.SocketIO)
  io: SocketIOServer;

  @LifecycleHook()
  async willReady() {
    const io = this.io;
    io.on('connection', (socket) => {
      console.log('lifecycle:io:connection', socket.id);
    });
  }
}
