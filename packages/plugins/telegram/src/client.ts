import { Injectable, ScopeEnum } from '@artus/core';
import { InjectEnum } from './constants';

import { Api, TelegramClient as _TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { LogLevel } from 'telegram/extensions/Logger';

export interface TelegramConfig {
  api_id: number;
  api_hash: string;
  app_title: string;

  session_string: string;
  bot_auth_token?: string;

  proxy?: {
    ip: string;
    port: number;
    socksType: number;
    proxyString: string;
  };
}

@Injectable({
  id: InjectEnum.Telegram,
  scope: ScopeEnum.SINGLETON,
})
export default class TelegramClient {
  private me: Api.User;
  private telegram: _TelegramClient;

  async init(config: TelegramConfig) {
    if (!config) {
      return;
    }

    const { api_id, api_hash, proxy, session_string } = config;
    const stringSession = new StringSession(session_string);

    let _proxy: any = null;

    if (proxy) {
      _proxy = {
        ip: proxy.ip,
        port: proxy.port,
        socksType: proxy.socksType,
      };
    }

    this.telegram = new _TelegramClient(stringSession, api_id, api_hash, {
      // @ts-ignore
      proxy: _proxy,
      connectionRetries: 5,
      useWSS: false,
    });

    this.telegram.setLogLevel(LogLevel.INFO);

    await this.telegram.connect();
    this.me = (await this.telegram.getMe()) as Api.User;
  }

  getMe(): Api.User {
    return this.me;
  }

  getClient(): _TelegramClient {
    return this.telegram;
  }
}
