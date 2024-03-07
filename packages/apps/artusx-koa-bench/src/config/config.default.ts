import { ArtusxConfig } from '@artusx/core';

export default () => {
  const artusx: ArtusxConfig = {
    port: 7001,
    middlewares: [],
  };

  return {
    artusx,
  };
};
