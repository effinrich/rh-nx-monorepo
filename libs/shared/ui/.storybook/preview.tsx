import { createLocalStorageManager } from '@chakra-ui/react'
import { INITIAL_VIEWPORTS } from 'storybook/viewport'

import { DocsContainer, DocsContainerProps } from '@storybook/addon-docs/blocks'

import { theme, ThemeProvider } from '../src/index'

import { viewports as breakpoints } from './viewports'

// Create custom viewports using widths defined in design tokens
const breakpointViewports = Object.keys(breakpoints).reduce(
  (breakpoint, key) => {
    breakpoint[`breakpoint${key}`] = {
      name: `Breakpoint - ${key}`,
      styles: {
        width: `${breakpoints[key as keyof typeof breakpoints]}px`,
        // Account for padding and border around viewport preview
        height: 'calc(100% - 20px)'
      },
      type: 'other'
    }
    return breakpoint
  },
  {} as typeof INITIAL_VIEWPORTS
)

const storageManager = createLocalStorageManager('sb-color-mode')

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  docs: {
    toc: true,
    source: {
      excludeDecorators: true
    },
    container: (props: DocsContainerProps) => (
      <ThemeProvider theme={theme}>
        <DocsContainer {...props} />
      </ThemeProvider>
    )
  },
  controls: {
    // expanded: true,
    hideNoControlsWarning: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  viewport: {
    options: {
      ...breakpointViewports,
      ...INITIAL_VIEWPORTS
    }
  },
  chromatic: { disableSnapshot: true },
  chakra: { colorModeManager: storageManager, theme }
}
export const tags = ['autodocs']
