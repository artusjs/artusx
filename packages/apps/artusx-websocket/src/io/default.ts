import { Inject } from '@artusx/core';
import { PluginInjectEnum } from '@artusx/utils';
import { SocketIOServer, Namespace, Event } from '@artusx/plugin-socketio';

@Namespace('/')
export default class DefaultNamespace {
  @Inject(PluginInjectEnum.SocketIO)
  io: SocketIOServer;

  @Event('disconnect')
  disconnect() {
    console.log('user disconnected');
  }

  @Event('chat_message')
  chat_message(msg: any) {
    console.log('chat_message.msg', msg);
    this.io.emit('chat_message', msg);
  }
}
