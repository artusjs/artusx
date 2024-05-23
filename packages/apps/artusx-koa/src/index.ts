import path from 'path';
import { initOtl, initMeter, initTracer } from '@artusx/otl';
import { bootstrap } from '@artusx/utils';

const ROOT_DIR = path.resolve(__dirname);

initOtl('artusx-koa', '1.0.0');
initMeter();
initTracer();

bootstrap({ root: ROOT_DIR });
