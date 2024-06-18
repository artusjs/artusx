import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';
import replace from '@rollup/plugin-replace';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      srcDir: 'src',
      filename: 'service-worker.ts',
      strategies: 'injectManifest',
      injectRegister: 'script-defer',
      manifest: false,
      injectManifest: {
        injectionPoint: undefined,
      },
      devOptions: {
        enabled: process.env.SW_DEV === 'true',
        type: 'module',
      },
    }),
    replace({
      __DATE__: new Date().toISOString(),
      __RELOAD_SW__: process.env.RELOAD_SW === 'true' ? 'true' : 'false',
    }),
  ],
});
