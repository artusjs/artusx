import path from 'path';
import { ArtusxConfig } from '@artusx/core';

export default () => {
    const artusx: ArtusxConfig = {
      port: 7001,    
      static: {
        prefix: '/public/',
        dir: path.resolve(__dirname, '../public'),
      },
    };
    
    return {
      artusx,      
    };
};
