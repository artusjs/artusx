import path from 'path';
import { ArtusXConfig, NunjucksConfigureOptions } from '@artusx/core';

export default () => {
    const artusx: ArtusXConfig = {
      port: 7001,    
      static: {
        prefix: '/public/',
        dir: path.resolve(__dirname, '../public'),
      },
    };
    
    const nunjucks: NunjucksConfigureOptions = {
      path: path.resolve(__dirname, '../view'),
      options: {
        autoescape: true,
        noCache: true,
      },
    };

    return {
      artusx,
      nunjucks,    
    };
};
