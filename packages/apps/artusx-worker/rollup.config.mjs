import typescript from '@rollup/plugin-typescript';
import nodePolyfills from 'rollup-plugin-node-polyfills';

/**
 * @type {import('rollup').RollupOptions}
 * @see https://rollupjs.org/guide/en/#configuration-files
 */
export default {
  input: 'src/index.ts',
  plugins: [nodePolyfills(), typescript()],
  output: {
    file: 'bundle.js',
    format: 'module',
  },
};
