import {
  ApplicationLifecycle,
  ArtusApplication,
  Inject,
  ArtusInjectEnum,
  LifecycleHookUnit,
  LifecycleHook,
} from '@artus/core';
import { InjectEnum } from './constants';
import Server from './server';

@LifecycleHookUnit()
export default class PluginLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @Inject(InjectEnum.SocketIO)
  io: Server;

  @LifecycleHook()
  async willReady() {
    // const io = this.io;
    // io.on('connection', (socket) => {
    //   console.log('a user connected');
    //   socket.on('disconnect', () => {
    //     console.log('user disconnected');
    //   });
    // });
  }
}
