import { joinPathFragments } from '@nx/devkit'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  root: __dirname,
  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    outDir: '../../../../dist/libs/portal/features/ip-marketplace',
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: 'portal-features-ip-marketplace',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forgot to update your package.json as well.
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: ['react', 'react-dom', 'react/jsx-runtime']
    }
  },
  cacheDir: '../../../../node_modules/.vite/portal-features-ip-marketplace',

  plugins: [
    react(),
    nxViteTsPaths(),
    dts({
      entryRoot: 'src',
      tsconfigPath: joinPathFragments(__dirname, 'tsconfig.lib.json'),
      skipDiagnostics: true
    })
  ],

  test: {
    reporters: ['default'],
    coverage: {
      reportsDirectory:
        '../../../../coverage/libs/portal/features/ip-marketplace',
      provider: 'v8'
    },
    globals: true,
    cache: {
      dir: '../../../../node_modules/.vitest'
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
  }
})
