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
import type { GRPCConfig } from '@artusx/plugin-grpc'

export default () => {
  const grpc: GRPCConfig = {
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

  @GRPCHandler({
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
import assert from 'assert';
import * as grpc from '@grpc/grpc-js';

import { Inject, ArtusInjectEnum } from '@artus/core';
import { Schedule } from '@artusx/plugin-schedule';
import type { ArtusxSchedule } from '@artusx/plugin-schedule';

import { GRPCConfig } from '@artusx/plugin-grpc';
import { ChatClient, ClientMessage } from '../proto-codegen/chat';

@Schedule({
  enable: true,
  cron: '30 * * * * *',
  runOnInit: true,
})
export default class NotifySchedule implements ArtusxSchedule {
  @Inject(ArtusInjectEnum.Config)
  config: Record<string, any>;

  private async invokeStatic() {
    const config: GRPCConfig = this.config.grpc;

    assert(config?.server, 'config.server is required');
    const { host, port } = config?.server;
    const serverUrl = `${host || 'localhost'}:${port}`;

    const chatClient = new ChatClient(serverUrl, grpc.credentials.createInsecure());
    const message = new ClientMessage({
      user: '@client',
      text: 'hello',
    });

    try {
      const response = await chatClient.join(message);
      console.log('response', response.toObject());
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
import { GRPC, GRPCHandler } from '@artusx/plugin-grpc';

interface EchoRequest {
  message : string;
}

interface EchoResponse {
  message: string;
}

@GRPC({
  packageName: 'grpc.examples.echo',
  serviceName: 'Echo',
})
export default class EchoService {
  @GRPCHandler({
    enable: true,
  })
  UnaryEcho(call: grpc.ServerUnaryCall<EchoRequest, EchoResponse>, callback: grpc.requestCallback<EchoResponse>) {
    console.log('server:Echo:UnaryEcho', call.request);
    callback(null, {
      message: 'getMessage: ' + call.request.message,
    });
  }
}
```

Client

```ts
import assert from 'assert';

import { Inject, ArtusInjectEnum } from '@artus/core';
import { ArtusXInjectEnum } from '@artusx/utils';

import { Schedule } from '@artusx/plugin-schedule';
import type { ArtusxSchedule } from '@artusx/plugin-schedule';

import { GRPCClient, GRPCConfig } from '@artusx/plugin-grpc';
import { credentials } from '@artusx/plugin-grpc/types';

@Schedule({
  enable: true,
  cron: '30 * * * * *',
  runOnInit: true,
})
export default class NotifySchedule implements ArtusxSchedule {
  @Inject(ArtusInjectEnum.Config)
  config: Record<string, any>;

  @Inject(ArtusXInjectEnum.GRPC)
  grpcClient: GRPCClient;

  private async invokeDynamic() {
    const config: GRPCConfig = this.config.grpc;

    assert(config?.server, 'config.server is required');
    const { host, port } = config?.server;
    const serverUrl = `${host || 'localhost'}:${port}`;

    const EchoService = this.grpcClient.getService('grpc.examples.echo', 'Echo');
    assert(EchoService, 'Service is required');
    const echoClient = new EchoService(serverUrl, credentials.createInsecure());

    echoClient.UnaryEcho({ message: 'ping' }, function (_err: Error, response: any) {
      console.log('client:Echo:UnaryEcho', response);
    });
  }

  async run() {
    await this.invokeDynamic();
  }
}
```
