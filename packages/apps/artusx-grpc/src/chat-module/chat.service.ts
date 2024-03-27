import * as grpc from '@grpc/grpc-js';
import { GRPC, GRPCHandler } from '@artusx/plugin-grpc';
import { ClientMessage, ServerMessage, UnimplementedChatService } from '../proto-codegen/chat';

@GRPC({
  packageName: 'chat_package',
  serviceName: 'Chat',
  definition: UnimplementedChatService.definition,
})
export default class ChatService extends UnimplementedChatService {
  @GRPCHandler({
    enable: true,
  })
  join(
    call: grpc.ServerUnaryCall<ClientMessage, ServerMessage>,
    callback: grpc.requestCallback<ServerMessage>
  ): void {
    callback(null, new ServerMessage({ user: call.request.user, text: 'method.join.callback' }));
  }

  send(
    call: grpc.ServerUnaryCall<ClientMessage, ServerMessage>,
    callback: grpc.requestCallback<ServerMessage>
  ): void {
    callback(null, new ServerMessage({ user: call.request.user, text: 'method.join.callback' }));
  }
}
