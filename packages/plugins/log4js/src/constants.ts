export enum ArtusXInjectEnum {
  Client = 'ARTUSX_LOG4JS',
}

export const defaultLog4jsConfig = {
  appenders: {
    console: { type: 'console' },
  },
  categories: {
    default: { appenders: ['console'], level: 'info' },
  },
};
