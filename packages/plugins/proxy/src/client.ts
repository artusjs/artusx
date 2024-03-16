import { Injectable, ScopeEnum } from '@artus/core';
import { ArtusXInjectEnum } from './constants';
import { SocksProxyAgent } from 'socks-proxy-agent';

export interface ProxyConfig {
  key: string;
  proxyString: string;
}

@Injectable({
  id: ArtusXInjectEnum.Proxy,
  scope: ScopeEnum.SINGLETON,
})
export default class ProxyClient {
  private httpsAgent: SocksProxyAgent;

  async init(config: ProxyConfig) {
    this.httpsAgent = new SocksProxyAgent(config.proxyString);
  }

  getClient(): SocksProxyAgent {
    return this.httpsAgent;
  }
}
