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
      return `${vars.name} app powered artusx`;
    },
  },
  author: {
    desc: 'package author',
    default: 'Suyi <thonatos.yang@gmail.com>',
  },
  monorepo: {
    desc: 'managed by monorepo, enter anything to confirm',
    filter(v) {
      if (v) {
        return 'workspace:*';
      }

      return 'latest';
    },
  },
};
