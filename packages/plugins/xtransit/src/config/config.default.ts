export default () => {
  return {
    xprofiler: {
      log_level: 1,
      enable_http_profiling: false,
    },

    xtransit: {
      server: '',
      appId: '',
      appSecret: '',

      disks: [],
      errors: [
        // `${tmpDir}/logs/common-error.log`,
        // `${tmpDir}logs/stderr.log`
      ],
      packages: [
        // `${rootDir}/package.json`
      ],

      // logDir: 'xprofiler',
      logInterval: undefined,
      ipMode: false,
      libMode: true,
      errexp: /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/i,
      logger: undefined,
      checkThrow: true,
    },
  };
};
