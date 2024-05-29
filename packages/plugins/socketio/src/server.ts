import { Injectable, Inject, ScopeEnum, ArtusInjectEnum } from '@artus/core';
import { Server } from 'socket.io';
import { InjectEnum } from './constants';
import { SocketIOServerConfig } from './types';

interface ISocketIOServer extends Server {}

@Injectable({
  id: InjectEnum.SocketIO,
  scope: ScopeEnum.SINGLETON,
})
export default class SocketIOServer extends Server implements ISocketIOServer {
  constructor(@Inject(ArtusInjectEnum.Config) public config: any) {
    const options = config.socketio as SocketIOServerConfig;
    super(options);
  }
}

export { SocketIOServer };
