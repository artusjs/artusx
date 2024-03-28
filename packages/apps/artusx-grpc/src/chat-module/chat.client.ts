import assert from 'assert';
import * as grpc from '@grpc/grpc-js';
import { Inject, ArtusInjectEnum, Injectable, ScopeEnum } from '@artus/core';
import { ChatClient as Client } from '../proto-codegen/chat';

@Injectable({
  scope: ScopeEnum.EXECUTION,
})
export default class ChatClient extends Client {
  constructor(@Inject(ArtusInjectEnum.Config) public config: any) {
    const { addr } = config.grpc?.client || {};
    assert(addr, 'addr is required');
    super(addr, grpc.credentials.createInsecure());
  }
}
