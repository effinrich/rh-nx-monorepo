import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { ColorModeProvider, system } from '@redesignhealth/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { initialize, mswLoader } from 'msw-storybook-addon'

import type { Preview, StoryContext } from '@storybook/react-vite'

// Initialize MSW
initialize()
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

const preview: Preview = {
  parameters: {
    actions: { disable: true },
    docs: {
      toc: true // 👈 Enables the table of contents
    },
    autodocs: true,
    controls: {
      // expanded: true,
      hideNoControlsWarning: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  },
  loaders: [mswLoader],
  decorators: [
    (Story: React.ComponentType, context: StoryContext) => {
      return (
        <ColorModeProvider
          forcedTheme={context.globals.theme}
          enableSystem={false}
        >
          <QueryClientProvider client={queryClient}>
            <ChakraProvider value={system}>
              <Story />
            </ChakraProvider>
          </QueryClientProvider>
        </ColorModeProvider>
      )
    }
  ]
}

export default preview
