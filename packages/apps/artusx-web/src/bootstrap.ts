import path from 'path';
import { Application } from '@artusx/utils';

(async () => {
  const app = await Application.start({
    root: path.resolve(__dirname),
    configDir: 'config'
  });

  console.log(app.config);
})();
