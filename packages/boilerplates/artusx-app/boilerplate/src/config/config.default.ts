import path from 'path';
import { ArtusxConfig, NunjucksConfigureOptions } from '@artusx/core';

export default () => {
    const artusx: ArtusxConfig = {
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
