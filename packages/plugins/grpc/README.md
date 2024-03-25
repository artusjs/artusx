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
export interface GRPCConfig {
  protoList: string[];
  server?: {
    host: string;
    port: number;
  };
}
```

## Server

GRPC Proto

```proto
// Copyright 2015 gRPC authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

syntax = "proto3";

option java_multiple_files = true;
option java_package = "io.grpc.examples.helloworld";
option java_outer_classname = "HelloWorldProto";
option objc_class_prefix = "HLW";

package helloworld;

// The greeting service definition.
service Greeter {
  // Sends a greeting
  rpc SayHello (HelloRequest) returns (HelloReply) {}

  rpc SayHelloStreamReply (HelloRequest) returns (stream HelloReply) {}
}

// The request message containing the user's name.
message HelloRequest {
  string name = 1;
}

// The response message containing the greetings
message HelloReply {
  string message = 1;
  string from = 2;
}
```

GRPC Handler

```ts
import { GRPC, GRPCHandler } from '@artusx/plugin-grpc';

@GRPC({
  packageName: 'helloworld',
  serviceName: 'Greeter',
})
export default class GreeterService {
  @GRPCHandler({
    enable: true,
  })
  sayHello(call: any, callback: any) {
    console.log('server:Greeting:sayHello', call.request);
    callback(null, {
      message: 'Hello ' + call.request.name,
      from: 'handler 222',
    });
  }
}
```

## Client

```ts
import assert from 'assert';
import { Inject, ApplicationLifecycle, LifecycleHook, LifecycleHookUnit, ArtusInjectEnum } from '@artus/core';
import { GRPCClient, GRPCConfig } from '@artusx/plugin-grpc';
import { credentials } from '@artusx/plugin-grpc/types';
import { ArtusXInjectEnum } from '@artusx/utils';

@LifecycleHookUnit()
export default class CustomLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Config)
  config: Record<string, any>;

  @Inject(ArtusXInjectEnum.GRPC)
  grpcClient: GRPCClient;

  @LifecycleHook()
  async didReady() {}
  
  private async invoke() {
    const config: GRPCConfig = this.config.grpc;

    assert(config?.server, 'config.server is required');
    const { host, port } = config?.server;
    const serverUrl = `${host || 'localhost'}:${port}`;    

    // greeter
    const GreeterService = this.grpcClient.getService('helloworld', 'Greeter');
    assert(GreeterService, 'GreeterService is required');
    const GreeterClient = new GreeterService(serverUrl, credentials.createInsecure());
    GreeterClient.sayHello({ name: 'you' }, function (_err: Error, response: any) {
      console.log('client:Greeting:sayHello', response);
    });    
  }

  @LifecycleHook()
  public async willReady() {    
    await this.invoke();
  }
}
```
