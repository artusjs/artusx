import 'reflect-metadata';
import { ArtusApplication, ArtusInjectEnum, Scanner } from '@artus/core';

export async function start(options: any = {}) {
  const scanner = new Scanner({
    needWriteFile: false,
    configDir: 'config',
    extensions: ['.ts'],
    framework: options.framework || { path: __dirname },
    exclude: options.exclude || ['bin', 'test', 'coverage', 'src']
  });

  const baseDir = options.baseDir || process.cwd();
  const manifest = await scanner.scan(baseDir);

  const artusEnv = options.artusEnv || 'default';
  const app = new ArtusApplication({
    env: 'default',
    containerName: ArtusInjectEnum.DefaultContainerName
  });
  await app.load(manifest[artusEnv], baseDir);

  await app.run();

  return app;
}
