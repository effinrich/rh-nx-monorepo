import '@testing-library/jest-dom'
import '@testing-library/jest-dom'

import * as React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/provider'
import { theme } from '@chakra-ui/theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render as rtlRender, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

export interface ChakraRenderOptions extends RenderOptions {
  withChakraProvider?: boolean
}

export const render = (
  ui: React.ReactElement,
  { withChakraProvider, ...options }: ChakraRenderOptions = {
    withChakraProvider: true
  }
): ReturnType<typeof rtlRender> & {
  user: ReturnType<typeof userEvent.setup>
} => {
  const { wrapper: Wrapper = React.Fragment, ...rtlOptions } = options
  const user = userEvent.setup()

  const MaybeChakraProvider = withChakraProvider
    ? ChakraProvider
    : React.Fragment

  const props = withChakraProvider ? { theme } : {}
  const queryClient = new QueryClient()
  const App = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <MaybeChakraProvider {...props}>
          <Wrapper>{ui}</Wrapper>
        </MaybeChakraProvider>
      </QueryClientProvider>
    )
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: 'dashboard',
          element: <div>Dashboard</div>
        },
        {
          path: 'about',
          element: <div>About</div>
        }
      ]
    }
  ])

  // const renderApp = () => {}

  const view = rtlRender(<RouterProvider router={router} />, rtlOptions)

  return { user, ...view }
}
