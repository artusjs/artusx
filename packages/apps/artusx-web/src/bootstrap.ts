import path from 'path';
import { Application } from '@artusx/run';

(async () => {
  const app = await Application.start({
    root: path.resolve(__dirname),
    name: 'app',
    configDir: 'config'
  });

  console.log(app.config);
})();
