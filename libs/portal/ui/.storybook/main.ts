import { createRequire } from "node:module";
import path, { dirname, join } from 'path';
import { mergeConfig } from 'vite'
import turbosnap from 'vite-plugin-turbosnap'

import type { StorybookConfig } from '@storybook/react-vite'

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/lib/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)'
  ],

  addons: [getAbsolutePath("@nx/react/plugins/storybook"), getAbsolutePath("@chakra-ui/storybook-addon"), getAbsolutePath("@storybook/addon-a11y"), getAbsolutePath("@storybook/addon-links"), getAbsolutePath("storybook/internal/instrumenter"), getAbsolutePath("storybook-addon-react-router-v6"), getAbsolutePath("@storybook/addon-designs"), getAbsolutePath("@chromaui/addon-visual-tests"), {
    name: getAbsolutePath("@storybook/addon-coverage"),
    options: {
      istanbul: {
        include: ['**/src/lib/**/*.stories.{ts,tsx}']
      }
    }
  }, getAbsolutePath("@storybook/addon-docs")],

  staticDirs: ['../public'],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {}
  },

  /**
   * 1st workaround on May 23, 2023  (currently using): https://github.com/nrwl/nx/issues/17156#issuecomment-155932054
   * 2nd, official, workaround on June 23, 2023: https://github.com/nrwl/nx/issues/17156#issuecomment-1603958601
   *  */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async viteFinal(config: Record<string, any>) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@redesignhealth/ui': path.resolve(
            __dirname,
            '../../../shared/ui/src/index.ts'
          ),
          '@redesignhealth/portal/utils': path.resolve(
            __dirname,
            '../../utils/src/index.ts'
          ),
          '@redesignhealth/portal/data-assets': path.resolve(
            __dirname,
            '../../data-assets/src/index.ts'
          ),
          '@redesignhealth/portal/features/library': path.resolve(
            __dirname,
            '../../features/library/src/index.ts'
          )
        }
      },
      define: {
        'import.meta.env': {}
      },
      plugins: [
        turbosnap({
          // This should be the base path of your storybook.  In monorepos, you may only need process.cwd().
          rootDir: process.cwd()
        })
      ]
    })
  }
}

export default config

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
