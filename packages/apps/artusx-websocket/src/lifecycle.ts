import {
  ApplicationLifecycle,
  ArtusApplication,
  Inject,
  ArtusInjectEnum,
  LifecycleHookUnit,
  LifecycleHook,
} from '@artusx/core';
import { PluginInjectEnum } from '@artusx/utils';
import Server from '@artusx/plugin-socketio/server';

@LifecycleHookUnit()
export default class PluginLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @Inject(PluginInjectEnum.SocketIO)
  io: Server;

  @LifecycleHook()
  async willReady() {
    const io = this.io;
    io.on('connection', (socket) => {
      console.log('a user connected');
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });

      socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
      });
    });
  }
}
