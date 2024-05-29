import type { ServerOptions } from 'socket.io';

export type SocketIOServerConfig = Partial<ServerOptions>;

export type NamespaceMetadata = {
  name: string;
};

export type EventMetadata = {
  name: string;
};

export type NamespaceEvent = {
  eventMetadata: EventMetadata;
  handler: (...args: any[]) => void;
};
