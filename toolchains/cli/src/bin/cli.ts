#!/usr/bin/env node

import path from 'path';
import { start } from '@artus-cli/artus-cli';

start({
  baseDir: path.join(path.resolve(__dirname, '..')),
});
