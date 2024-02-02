import os from 'os';
import path from 'path';
import fs from 'fs-extra';

const tmpDir = os.tmpdir();
const rootDir = path.resolve(__dirname, '../..');
const logsDir = path.join(tmpDir, 'artusx/logs');
const xprofilerLogDir = path.join(logsDir, 'xprofiler');

export default () => {
  fs.ensureDirSync(logsDir);
  fs.ensureDirSync(xprofilerLogDir);

  return {
    xtransit: {
      server: 'ws://127.0.0.1:9190',
      appId: '1',
      appSecret: '88115b3f0881348fe4a8935b103c0a74',

      logDir: xprofilerLogDir,

      errors: [`${logsDir}/logs/common-error.log`, `${logsDir}/logs/stderr.log`],
      packages: [`${rootDir}/package.json`],
    },
  };
};
