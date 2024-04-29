import assert from 'assert';
import { credentials } from '@artusx/plugin-grpc/types';
import { ArtusInjectEnum, Inject, Injectable, ScopeEnum } from '@artus/core';
import { PluginInjectEnum } from '@artusx/utils';
import { ArtusXGrpcClient } from '@artusx/plugin-grpc';

@Injectable({
  scope: ScopeEnum.EXECUTION,
})
export default class EchoClient {
  private echoService: any;

  constructor(
    @Inject(ArtusInjectEnum.Config) public config: any,
    @Inject(PluginInjectEnum.GRPC) public grpcClient: ArtusXGrpcClient
  ) {
    const { addr } = config.grpc?.client || {};
    assert(addr, 'addr is required');

    const EchoService = grpcClient.getService('grpc.examples.echo', 'Echo');
    this.echoService = new EchoService(addr, credentials.createInsecure());
  }

  UnaryEcho(call: any, callback: any) {
    this.echoService.UnaryEcho(call, callback);
  }
}
