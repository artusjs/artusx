import { credentials } from '@artusx/plugin-grpc/types';
import { Inject } from '@artus/core';
import { ArtusXInjectEnum } from '@artusx/utils';
import { ArtusXGrpcClient, GrpcClient } from '@artusx/plugin-grpc';
import { ArtusXGrpcClientClass } from '@artusx/plugin-grpc/types';
import { ChatClient } from '../proto-codegen/chat';

@GrpcClient({
  load: true,
})
export default class Chat extends ArtusXGrpcClientClass<ChatClient> {
  @Inject(ArtusXInjectEnum.GRPC)
  grpcClient: ArtusXGrpcClient;

  init(addr: string) {
    const EchoService = this.grpcClient.getService('grpc.examples.echo', 'Echo');
    return new EchoService(addr, credentials.createInsecure());
  }
}
