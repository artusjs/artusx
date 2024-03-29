import { ArtusXConfig } from '@artusx/core';

export default () => {
  const artusx: ArtusXConfig = {
    port: 7001,
    middlewares: [],
  };

  return {
    artusx,
  };
};
