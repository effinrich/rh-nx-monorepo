import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import react from '@vitejs/plugin-react'
import { join } from 'path'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/portal-ui',

  build: {
    outDir: '../../../dist/libs/portal/ui',
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: 'portal-ui',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forgot to update your package.json as well.
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: { sourcemap: true }
    }
  },

  plugins: [
    dts({
      entryRoot: 'src',
      tsConfigFilePath: join(__dirname, 'tsconfig.lib.json'),
      skipDiagnostics: true
    }),
    react(),
    nxViteTsPaths(),
    splitVendorChunkPlugin()
  ]

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: '../../../',
  //    }),
  //  ],
  // },

  // test: {
  //   globals: true,
  //   cache: {
  //     dir: '../../../node_modules/.vitest'
  //   },
  //   environment: 'jsdom',
  //   include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
  // }
})
