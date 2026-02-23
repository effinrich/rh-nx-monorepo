/// <reference types="vitest" />
import * as path from 'path'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  root: __dirname,
  build: {
    outDir: '../../dist/apps/portal',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  cacheDir: '../../node_modules/.vite/portal',

  server: { port: 4200, host: 'localhost' },

  optimizeDeps: {
    esbuildOptions: {
      define: {
        'process.env.NODE_ENV': JSON.stringify('development'),
      },
    },
  },

  preview: {
    port: 4300,
    host: 'localhost'
  },

  resolve: {
    alias: {
      // chakra-react-select v4/v5 uses Chakra v2 internals removed in v3.
      // Redirect to a shim that re-exports the same surface API via react-select.
      'chakra-react-select': path.resolve(
        __dirname,
        'src/shims/chakra-react-select.ts'
      ),
    }
  },

  plugins: [react(), nxViteTsPaths()],
  test: {
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/portal',
      provider: 'v8'
    },
    globals: true,
    silent: true,
    setupFiles: '../../vitest.setup',
    cache: { dir: '../../node_modules/.vitest' },
    environment: 'jsdom',
    include: ['src/**/*.spec.{ts,tsx}']
  }

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: '../../',
  //    }),
  //  ],
  // },
})
