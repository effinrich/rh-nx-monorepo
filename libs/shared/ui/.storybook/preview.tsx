import { ChakraProvider } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'

import { withThemeByClassName } from '@storybook/addon-themes'
import type { Preview, ReactRenderer } from '@storybook/react'

import { system } from '../src/lib/theme'

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Layout',
          'Typography',
          'Components',
          'Charts',
          'Rich Text Editor'
        ]
      }
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [
    withThemeByClassName<ReactRenderer>({
      defaultTheme: 'light',
      themes: {
        light: '',
        dark: 'dark'
      }
    }),
    Story => (
      <ThemeProvider
        attribute="class"
        disableTransitionOnChange
        defaultTheme="light"
      >
        <ChakraProvider value={system}>
          <Story />
        </ChakraProvider>
      </ThemeProvider>
    )
  ]
}

export default preview
