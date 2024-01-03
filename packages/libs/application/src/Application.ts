import 'reflect-metadata';
import path from 'path';
import { existsSync } from 'fs';
import { ArtusApplication, Manifest, Scanner } from '@artus/core';

interface ApplicationOptions {
  root?: string;
  name?: string;
  configDir?: string;
  exclude?: string[];
}

export class Application extends ArtusApplication {
  public manifest: Manifest;
  public options: ApplicationOptions;
  public env: string;

  constructor(
    options: ApplicationOptions = {
      root: path.resolve('.'),
      name: 'app',
      configDir: 'config',
      exclude: []
    }
  ) {
    super();
    this.options = options;
    this.env = process.env.ARTUS_SERVER_ENV ?? 'default';
  }

  public static async start(options?: ApplicationOptions) {
    const app = new Application(options);
    await app.init();
    await app.run();
    return app;
  }

  public async init() {
    // 准备 manifest
    const manifestFilePath = path.resolve(this.options.root!, 'manifest.json');
    let multiEnvManifest: Record<string, Manifest>;
    if (existsSync(manifestFilePath)) {
      // 判断是否能存在 manifest，如果存在直接使用
      // 如下使用 scanner 时设置 needWriteFile 为 false
      // 说明框架启动时不会主动生成 manifest 文件
      // manifest 文件的生成交个额外的构建命令
      multiEnvManifest = require(manifestFilePath);
    } else {
      const scanner = new Scanner({
        configDir: this.options.configDir,
        appName: this.options.name,
        needWriteFile: false,
        useRelativePath: true,
        extensions: ['.js', '.json', '.node', '.ts'],
        exclude: this.options.exclude
      });
      multiEnvManifest = await scanner.scan(this.options.root!);
    }
    this.manifest = multiEnvManifest[this.env];

    // 加载
    await this.load(this.manifest, this.options.root);
    return this;
  }
}
