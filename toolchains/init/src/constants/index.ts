import path from 'path';

export enum PKG_TYPE_ENUM {
  App = 'apps',
  Lib = 'libs',
  Plugin = 'plugins',
}

export const PKG_SCOPE_NAME = '@artusx';
export const PKG_PREFIX_NAME = 'artusx';

export const RUSH_ROOT_PATH = path.resolve(__dirname, '../../../..');
export const RUSH_CONFIG_PATH = path.join(RUSH_ROOT_PATH, 'rush.json');
export const RUSH_VERSION_PATH = path.join(RUSH_ROOT_PATH, 'common/config/rush/version-policies.json');

export const BOILERPLATE_PATH = path.join(RUSH_ROOT_PATH, 'packages/boilerplates');
export const BOILERPLATES = {
  [PKG_TYPE_ENUM.App]: path.join(BOILERPLATE_PATH, 'artusx-app'),
  [PKG_TYPE_ENUM.Lib]: path.join(BOILERPLATE_PATH, 'artusx-lib'),
  [PKG_TYPE_ENUM.Plugin]: path.join(BOILERPLATE_PATH, 'artusx-plugin'),
};
