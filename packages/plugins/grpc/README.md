# @artusx/plugin-grpc

## Plugin

```ts
export default {
  grpc: {
    enable: true,
    package: '@artusx/plugin-grpc',
  },
};
```

## Config

```ts
import path from 'path';
import type { ArtusxGrpcConfig } from '@artusx/plugin-grpc';

export default () => {
  const grpc: ArtusxGrpcConfig = {
    client: {
      host: '0.0.0.0',
      port: 50051,
    },

    server: {
      host: '0.0.0.0',
      port: 50051,
    },

    static: {
      proto: path.resolve(__dirname, '../proto'),
      codegen: path.resolve(__dirname, '../proto-codegen'),
    },

    dynamic: {
      proto: [path.resolve(__dirname, '../echo-module/proto/echo.proto')],
    },
  };

  return {
    grpc,
  };
};
```

## Static

Proto

```proto
syntax = "proto3";

package chat_package;

message ServerMessage {
  string user = 1;
  string text = 2;
}

message ClientMessage {
  string user = 1;
  string text = 2;
}

service Chat {
  rpc join(ClientMessage) returns (ServerMessage) {}
  rpc send(ClientMessage) returns (ServerMessage) {}  
}
```

Server

```ts
import * as grpc from '@grpc/grpc-js';
import { GrpcService, GrpcMethod } from '@artusx/plugin-grpc';
import { ClientMessage, ServerMessage, UnimplementedChatService } from '../proto-codegen/chat';

@GrpcService({
  packageName: 'chat_package',
  serviceName: 'Chat',
  definition: UnimplementedChatService.definition,
})
export default class ChatService extends UnimplementedChatService {
  @GrpcMethod({
    enable: true,
  })
  join(
    call: grpc.ServerUnaryCall<ClientMessage, ServerMessage>,
    callback: grpc.requestCallback<ServerMessage>
  ): void {
    console.log('server:Chat:join', call.request.toObject());
    callback(null, new ServerMessage({ user: call.request.user, text: 'method.join.callback' }));
  }

  @GrpcMethod({
    enable: true,
  })
  send(
    call: grpc.ServerUnaryCall<ClientMessage, ServerMessage>,
    callback: grpc.requestCallback<ServerMessage>
  ): void {
    callback(null, new ServerMessage({ user: call.request.user, text: 'method.join.callback' }));
  }
}
```

Client

```ts
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
```

Invoke

```ts
import { Inject } from '@artus/core';
import { Schedule } from '@artusx/plugin-schedule';
import type { ArtusxSchedule } from '@artusx/plugin-schedule';
import { ClientMessage } from '../proto-codegen/chat';
import ChatClient from './chat.client';

@Schedule({
  enable: true,
  cron: '30 * * * * *',
  runOnInit: true,
})
export default class NotifySchedule implements ArtusxSchedule {
  @Inject(ChatClient)
  chat: ChatClient;

  private async invokeStatic() {
    const chatClient = this.chat.getClient();

    const message = new ClientMessage({
      user: '@client',
      text: 'hello',
    });

    try {
      const response = await chatClient.join(message);
      console.log('client:Chat:join', response.toObject());
    } catch (error) {
      console.error('error:', error.details);
    }
  }

  async run() {
    await this.invokeStatic();
  }
}
```

## Dynamic

Proto

```proto
syntax = "proto3";

option go_package = "google.golang.org/grpc/examples/features/proto/echo";

package grpc.examples.echo;

// EchoRequest is the request for echo.
message EchoRequest {
  string message = 1;
}

// EchoResponse is the response for echo.
message EchoResponse {
  string message = 1;
}

// Echo is the echo service.
service Echo {
  // UnaryEcho is unary echo.
  rpc UnaryEcho(EchoRequest) returns (EchoResponse) {}
  // ServerStreamingEcho is server side streaming.
  rpc ServerStreamingEcho(EchoRequest) returns (stream EchoResponse) {}
  // ClientStreamingEcho is client side streaming.
  rpc ClientStreamingEcho(stream EchoRequest) returns (EchoResponse) {}
  // BidirectionalStreamingEcho is bidi streaming.
  rpc BidirectionalStreamingEcho(stream EchoRequest) returns (stream EchoResponse) {}
}
```

Server

```ts
import * as grpc from '@grpc/grpc-js';
import { GrpcService, GrpcMethod } from '@artusx/plugin-grpc';

interface EchoRequest {
  message: string;
}

interface EchoResponse {
  message: string;
}

@GrpcService({
  packageName: 'grpc.examples.echo',
  serviceName: 'Echo',
})
export default class EchoService {
  @GrpcMethod({
    enable: true,
  })
  UnaryEcho(
    call: grpc.ServerUnaryCall<EchoRequest, EchoResponse>,
    callback: grpc.requestCallback<EchoResponse>
  ) {
    console.log('server:Echo:UnaryEcho', call.request);
    callback(null, {
      message: 'getMessage: ' + call.request.message,
    });
  }
}
```

Client

```ts
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
```

Invoke

```ts
import { Inject } from '@artus/core';
import { Schedule } from '@artusx/plugin-schedule';
import type { ArtusxSchedule } from '@artusx/plugin-schedule';

import EchoClient from './echo.client';

@Schedule({
  enable: true,
  cron: '30 * * * * *',
  runOnInit: true,
})
export default class NotifySchedule implements ArtusxSchedule {
  @Inject(EchoClient)
  echo: EchoClient;

  private async invokeDynamic() {
    const echoClient = this.echo.getClient();

    echoClient.UnaryEcho({ message: 'ping' }, function (_err: Error, response: any) {
      console.log('client:Echo:UnaryEcho', response);
    });
  }

  async run() {
    await this.invokeDynamic();
  }
}
```
