/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  cacheDir:
    '../../../../node_modules/.vite/third-party-network-features-authentication',

  plugins: [
    react(),
    viteTsConfigPaths({
      root: '../../../../'
    })
  ],

  test: {
    globals: true,
    silent: true,
    setupFiles: '../../../../vitest.setup',
    cache: {
      dir: '../../../../node_modules/.vitest'
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
  }
})
