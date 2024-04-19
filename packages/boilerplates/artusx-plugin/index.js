module.exports = {
  name: {
    desc: 'name, used as directory name, do not use special symbols',
  },
  packageName: {
    desc: 'package name',
    default(vars) {
      return `@artusx/plugin-${vars.name}`;
    },
  },
  description: {
    desc: 'package description',
    default(vars) {
      return `${vars.name} plugin for artusx`;
    },
  },
  author: {
    desc: 'package author',
    default: 'Suyi <thonatos.yang@gmail.com>',
  },
  monorepo: {
    desc: 'update package dependencies? If it is a monorepo, enter to confirm',
    filter(v) {
      if (!v) {
        return 'workspace:*';
      }

      return 'latest';
    },
  },
};
