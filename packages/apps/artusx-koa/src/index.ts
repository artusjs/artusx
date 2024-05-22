import path from 'path';
import { setupTracing } from '@artusx/otl';
import { bootstrap } from '@artusx/utils';

const ROOT_DIR = path.resolve(__dirname);

setupTracing('artusx-koa');

bootstrap({ root: ROOT_DIR });
