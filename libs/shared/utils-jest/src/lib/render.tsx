import '@testing-library/jest-dom'

import * as React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render as rtlRender, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toHaveNoViolations } from 'jest-axe'

import { RhProvider } from '@redesignhealth/ui'

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

  const queryClient = new QueryClient()
  const App = () => {
    const content = (
      <QueryClientProvider client={queryClient}>
        <Wrapper>{ui}</Wrapper>
      </QueryClientProvider>
    )

    return withChakraProvider ? <RhProvider>{content}</RhProvider> : content
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

  const view = rtlRender(<RouterProvider router={router} />, rtlOptions)

  return { user, ...view }
}
