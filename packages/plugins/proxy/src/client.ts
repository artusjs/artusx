import { Injectable, ScopeEnum } from '@artus/core';
import { InjectEnum } from './constants';
import { SocksProxyAgent } from 'socks-proxy-agent';

export interface ProxyConfig {
  key: string;
  proxyString: string;
}

@Injectable({
  id: InjectEnum.Proxy,
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
