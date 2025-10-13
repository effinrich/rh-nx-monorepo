/// <reference types="vitest" />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/third-party-network-app',
  envDir: './environments',
  server: { port: 4200, host: 'localhost' },
  plugins: [
    react(),
    nxViteTsPaths(),
    nodePolyfills({ exclude: ['fs'], protocolImports: false })
  ],
  test: {
    globals: true,
    silent: true,
    setupFiles: '../../vitest.setup',
    cache: { dir: '../../node_modules/.vitest' },
    environment: 'jsdom',
    include: ['src/**/*.spec.{ts,tsx}']
  }
})
