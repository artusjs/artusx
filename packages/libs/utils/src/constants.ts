export enum PluginInjectEnum {
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
  Prometheus = 'ARTUSX_PROMETHEUS',
  ClickHouse = 'ARTUSX_CLICKHOUSE',

  GRPC = 'ARTUSX_GRPC',
  PPTR = 'ARTUSX_PPTR',
  Proxy = 'ARTUSX_PROXY',
  Log4js = 'ARTUSX_LOG4JS',
  OpenAI = 'ARTUSX_OPENAI',
  Telegram = 'ARTUSX_TELEGRAM',
  XTransit = 'ARTUSX_XTRANSIT',
  SocketIO = 'ARTUSX_SOCKETIO',
}
