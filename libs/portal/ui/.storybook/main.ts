import path from 'path'
import { mergeConfig } from 'vite'
import turbosnap from 'vite-plugin-turbosnap'

import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/lib/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)'
  ],
  addons: [
    // eslint-disable-next-line storybook/no-uninstalled-addons
    '@nx/react/plugins/storybook',
    '@chakra-ui/storybook-addon',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/instrumenter',
    '@storybook/addon-interactions',
    'storybook-addon-react-router-v6',
    '@storybook/addon-designs',
    '@chromaui/addon-visual-tests',
    {
      name: '@storybook/addon-coverage',
      options: {
        istanbul: {
          include: ['**/src/lib/**/*.stories.{ts,tsx}']
        }
      }
    }
  ],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  docs: {
    autodocs: true
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
