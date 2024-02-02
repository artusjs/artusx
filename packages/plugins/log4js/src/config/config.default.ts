export default {
  log4js: {
    appenders: {
      console: { type: 'console' },
    },
    categories: {
      default: { appenders: ['console'], level: 'info' },
    },
  },
};
