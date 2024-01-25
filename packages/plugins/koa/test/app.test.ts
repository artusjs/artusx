import path from 'path';
import assert from 'assert';
import { createApp } from './utils';
import HomeController from './fixtures/app/src/controller/home';

describe('test/app.test.ts', () => {
  let app;
  beforeAll(async () => {
    app = await createApp(path.resolve(__dirname, './fixtures/app'));
  });

  it('container should have koa', async () => {
    assert(app.container.get('ARTUSX_KOA'));
  });

  it('container should have home controller with home method', async () => {
    const homeController = app.container.get(HomeController);
    assert(homeController.home);
  });
});
