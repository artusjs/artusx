import * as grpc from '@grpc/grpc-js';
import { GrpcClient } from '@artusx/plugin-grpc';
import { ArtusXGrpcClientClass } from '@artusx/plugin-grpc/types';
import { ChatClient } from '../proto-codegen/chat';

@GrpcClient({
  load: true,
})
export default class Chat extends ArtusXGrpcClientClass<ChatClient> {
  init(addr: string) {
    return new ChatClient(addr, grpc.credentials.createInsecure());
  }
}
