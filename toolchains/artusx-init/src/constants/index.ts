import path from 'path';

export const SCOPE_NAME = '@artusx';

export const RUSH_ROOT_PATH = path.resolve(__dirname, '../../../..');
export const RUSH_CONFIG_PATH = path.join(RUSH_ROOT_PATH, 'rush.json');
export const RUSH_VERSION_PATH = path.join(RUSH_ROOT_PATH, 'common/config/rush/version-policies.json');

export const BOILERPLATE_PATH = path.join(__dirname, '../../boilerplate');
export const BOILERPLATES = {
  apps: path.join(BOILERPLATE_PATH, 'apps-boilerplate'),
  libs: path.join(BOILERPLATE_PATH, 'libs-boilerplate'),
  plugins: path.join(BOILERPLATE_PATH, 'plugins-boilerplate'),
};
