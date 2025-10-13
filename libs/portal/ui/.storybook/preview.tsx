import { createLocalStorageManager } from '@chakra-ui/react'
import { theme } from '@redesignhealth/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { initialize, mswLoader } from 'msw-storybook-addon'

import { StoryFn } from '@storybook/react'

// Initialize MSW
initialize()
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

const storageManager = createLocalStorageManager('sb-color-mode')

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  docs: {
    toc: true // 👈 Enables the table of contents
  },
  controls: {
    // expanded: true,
    hideNoControlsWarning: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  chromatic: { disableSnapshot: true },
  chakra: { colorModeManager: storageManager, theme }
}

export const loaders = [mswLoader]
export const decorators = [
  (Story: StoryFn) => (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  )
]
