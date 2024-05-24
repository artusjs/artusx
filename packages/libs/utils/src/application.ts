import 'reflect-metadata';
import path from 'path';
import { existsSync } from 'fs';
import { ArtusApplication, ArtusScanner } from '@artus/core';
import { getEnv } from './utils';

import type { Manifest } from '@artus/core';

export interface ApplicationOptions {
  root?: string;
  configDir?: string;
  exclude?: string[];
}

export class Application extends ArtusApplication {
  public env: string;
  public manifest: Manifest;
  public options: ApplicationOptions;

  constructor(
    options: ApplicationOptions = {
      root: path.resolve('.'),
      configDir: 'config',
      exclude: [],
    }
  ) {
    super();
    this.options = options;
    this.env = getEnv('ARTUSX_SERVER_ENV') || getEnv('ARTUS_SERVER_ENV') || 'default';
  }

  public static async start(options?: ApplicationOptions) {
    const app = new Application(options);
    await app.init();
    await app.run();
    return app;
  }

  public async init() {
    const manifestFilePath = path.resolve(this.options.root!, 'manifest.json');
    let manifest: Manifest;

    if (existsSync(manifestFilePath)) {
      manifest = require(manifestFilePath);
    } else {
      const scanner = new ArtusScanner({
        configDir: this.options.configDir,
        needWriteFile: false,
        useRelativePath: true,
        extensions: ['.js', '.json', '.node', '.ts'],
        exclude: this.options.exclude || ['bin', 'test', 'coverage', 'src', 'view', 'public'],
      });
      manifest = await scanner.scan(this.options.root!);
    }

    this.manifest = manifest;

    await this.load(this.manifest, this.options.root);
    return this;
  }
}
