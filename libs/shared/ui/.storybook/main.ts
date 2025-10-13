// import path from 'path'
import { mergeConfig, splitVendorChunkPlugin } from 'vite'
import turbosnap from 'vite-plugin-turbosnap'

import { type StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/lib/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)'
  ],
  addons: [
    'storybook-addon-react-router-v6',
    '@chakra-ui/storybook-addon',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/instrumenter',
    '@storybook/addon-interactions',
    '@storybook/addon-designs',
    '@chromaui/addon-visual-tests',
    {
      name: '@storybook/addon-coverage',
      options: {
        istanbul: {
          include: ['**/src/lib/**/*.stories.{ts,tsx}']
        }
      }
    },
    '@storybook/addon-mdx-gfm'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  docs: {
    autodocs: true
  },
  refs: {
    'portal-ui': {
      title: 'Portal UI',
      url: 'http://localhost:4401',
      expanded: false // Optional, true by default
    }
  },
  /**
   * 1st workaround on May 23, 2023: https://github.com/nrwl/nx/issues/17156#issuecomment-155932054
   * 2nd, official, workaround on June 23, 2023 (currently using): https://github.com/nrwl/nx/issues/17156#issuecomment-1603958601
   *  */

  async viteFinal(config: Record<string, any>, { configType }: any) {
    return mergeConfig(config, {
      plugins:
        configType === 'PRODUCTION'
          ? [
              turbosnap({
                // This should be the base path of your storybook.  In monorepos, you may only need process.cwd().
                rootDir: process.cwd()
              }),
              splitVendorChunkPlugin()
            ]
          : [splitVendorChunkPlugin()],
      define: {
        'import.meta.env': {}
      }
    })
  }
  // webpackFinal: async (config, { configType }) => {
  //   config.resolve.plugins.forEach(p => {
  //     if (Array.isArray(p.appSrcs)) {
  //       p.appSrcs.push(path.join(__dirname, '..', '..', '..'))
  //     }
  //   })

  //   config.module.rules = await config.module.rules.map(rule => {
  //     if (/file-loader/.test(rule.loader)) {
  //       return {
  //         ...rule,
  //         test: /\.(eot|cur|jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/, // Excluding `svg`
  //         type: 'javascript/auto' // Fixing images
  //       }
  //     }

  //     if (rule.test && rule.test.test('.svg')) {
  //       return {
  //         ...rule,
  //         use: ['@svgr/webpack', 'url-loader']
  //       }
  //     }

  //     return rule
  //   })
  //   // add your own webpack tweaks if needed

  //   return config
  // }
}

export default config
