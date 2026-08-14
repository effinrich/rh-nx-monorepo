import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import react from '@vitejs/plugin-react'
import { join } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  root: __dirname,
  build: {
    outDir: '../../../dist/libs/shared/markdown-renderer',
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: 'src/index.ts',
      name: 'shared-markdown-renderer',
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@tanstack/markdown',
        '@tanstack/markdown/parser',
        '@tanstack/markdown/html',
        '@tanstack/markdown/react',
        '@tanstack/markdown/extensions/streaming',
        '@tanstack/highlight',
        '@tanstack/highlight/core',
        '@tanstack/highlight/markdown'
      ]
    }
  },
  cacheDir: '../../../node_modules/.vite/shared-markdown-renderer',
  plugins: [
    dts({
      entryRoot: 'src',
      tsconfigPath: join(__dirname, 'tsconfig.lib.json')
    }),
    react(),
    nxViteTsPaths()
  ]
})
