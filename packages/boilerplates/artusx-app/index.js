module.exports = {
  name: {
    desc: 'name, used as directory name, do not use special symbols',
  },
  packageName: {
    desc: 'package name',
    default(vars) {
      return `artusx-${vars.name}`;
    },
  },
  description: {
    desc: 'package description',
    default(vars) {
      return `${vars.name} app powered by artusx`;
    },
  },
  author: {
    desc: 'package author',
    default: 'Suyi <thonatos.yang@gmail.com>',
  },
  monorepo: {
    desc: 'update package dependencies? If it is a monorepo, enter to confirm',
    filter(v) {
      if (v) {
        return 'workspace:*';
      }

      return 'latest';
    },
  },
  buildScript: {
    desc: 'keep build script settings? If it is a monorepo, enter to confirm',
    filter(v) {
      if (v) {
        return '';
      }

      return 'npm run tsc && npm run build:view';
    },
  },
};
