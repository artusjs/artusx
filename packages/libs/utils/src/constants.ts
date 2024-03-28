export enum ArtusXInjectEnum {
  Pipeline = 'ARTUSX_PIPELINE',
  Schedule = 'ARTUSX_SCHEDULE',

  // view engines
  EJS = 'ARTUSX_EJS',
  Nunjucks = 'ARTUSX_NUNJUCKS',

  // web framework
  Koa = 'ARTUSX_KOA',
  KoaRouter = 'ARTUSX_KOA_ROUTER',
  Nest = 'ARTUSX_NEST',
  Express = 'ARTUSX_EXPRESS',

  // database
  Redis = 'ARTUSX_REDIS',
  Sequelize = 'ARTUSX_SEQUELIZE',

  GRPC = 'ARTUSX_GRPC',
  Proxy = 'ARTUSX_PROXY',
  PPTR = 'ARTUSX_PPTR',
  Log4js = 'ARTUSX_LOG4JS',
  OpenAI = 'ARTUS_OPENAI',
  Telegram = 'ARTUS_TELEGRAM',
  XTransit = 'ARTUSX_XTRANSIT',
}

export enum ArtusXErrorEnum {
  UNKNOWN_ERROR = 'ARTUSX:UNKNOWN_ERROR',
}
