import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { LoggerOptions, LoggerLevel } from '@artus/core';

const tmpDir = os.tmpdir();
const rootDir = path.resolve(__dirname, '../..');
const logsDir = path.join(tmpDir, 'artusx/logs');
const xprofilerLogDir = path.join(logsDir, 'xprofiler');

export default () => {
  fs.ensureDirSync(logsDir);
  fs.ensureDirSync(xprofilerLogDir);

  const logger: LoggerOptions = {
    level: LoggerLevel.DEBUG,
  };

  return {
    // default logger
    logger,

    // log4js
    log4js: {
      appenders: {
        console: { type: 'console' },
        info: { type: 'file', filename: `${logsDir}/info.log` },
        error: { type: 'file', filename: `${logsDir}/error.log` },
      },
      categories: {
        console: {
          appenders: ['console'],
          level: 'info',
        },
        error: {
          appenders: ['error'],
          level: 'error',
        },
        default: {
          appenders: ['info'],
          level: 'info',
        },
      },
    },

    xprofiler: {
      log_level: 0,
      enable_http_profiling: true,
    },

    xtransit: {
      server: 'ws://127.0.0.1:9190',
      appId: '1',
      appSecret: '88115b3f0881348fe4a8935b103c0a74',

      logDir: xprofilerLogDir,
      logInterval: 60,

      errors: [`${logsDir}/info.log`, `${logsDir}/error.log`],
      packages: [`${rootDir}/package.json`],
    },
  };
};
