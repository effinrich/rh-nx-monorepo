import { Meta, StoryFn } from '@storybook/react-vite'
import { MemoryRouter, Route, Routes, useRouteError } from 'react-router-dom'

import { Box } from '../box/box'

import { RootBoundary } from './root-boundary'

export default {
  component: RootBoundary,
  title: 'Components / Feedback / RootBoundary',
  decorators: [
    (Story: any) => (
      <Box minH="500px">
        <Story />
      </Box>
    )
  ]
} as Meta<typeof RootBoundary>

// Mock logout function for stories
const mockLogout = (callback?: () => void) => {
  console.log('Logout called')
  callback?.()
}

// Error component that throws specific errors
const ThrowError = ({ error }: { error: any }) => {
  // eslint-disable-next-line @typescript-eslint/no-throw-literal
  throw error
}

// Wrapper to create an error boundary with specific error
const ErrorBoundaryWrapper = ({ error }: { error: any }) => {
  return (
    <MemoryRouter initialEntries={['/error']}>
      <Routes>
        <Route path="/error" element={<ThrowError error={error} />} />
        <Route path="/" element={<div>Home</div>} />
        <Route path="/sign-in" element={<div>Sign In</div>} />
      </Routes>
    </MemoryRouter>
  )
}

export const Error404: StoryFn<typeof RootBoundary> = () => (
  <ErrorBoundaryWrapper
    error={{
      status: 404,
      statusText: 'Not Found',
      data: {}
    }}
  />
)

export const Error403: StoryFn<typeof RootBoundary> = () => (
  <ErrorBoundaryWrapper
    error={{
      status: 403,
      statusText: 'Forbidden',
      data: {}
    }}
  />
)

export const Error400: StoryFn<typeof RootBoundary> = () => (
  <ErrorBoundaryWrapper
    error={{
      status: 400,
      statusText: 'Bad Request',
      data: {}
    }}
  />
)

export const Error500: StoryFn<typeof RootBoundary> = () => (
  <ErrorBoundaryWrapper
    error={{
      status: 500,
      statusText: 'Internal Server Error',
      data: {}
    }}
  />
)

export const AxiosError: StoryFn<typeof RootBoundary> = () => (
  <ErrorBoundaryWrapper
    error={{
      name: 'AxiosError',
      message: 'Network Error',
      response: {
        status: 500
      }
    }}
  />
)

export const GenericError: StoryFn<typeof RootBoundary> = () => (
  <ErrorBoundaryWrapper
    error={{
      name: 'Error',
      message: 'Something went wrong',
      response: {
        status: 500
      }
    }}
  />
)

// Story showing the component structure (for documentation purposes)
export const Documentation: StoryFn = () => (
  <Box p="6" borderWidth="1px" borderRadius="md">
    <h3 style={{ marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
      RootBoundary Component
    </h3>
    <p style={{ marginBottom: '0.5rem' }}>
      The RootBoundary component is an error boundary designed to work with
      React Router. It catches routing errors and displays appropriate error
      messages based on the HTTP status code.
    </p>
    <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem', fontWeight: 'semibold' }}>
      Supported Error Codes:
    </h4>
    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
      <li>400 - Bad Request</li>
      <li>403 - Forbidden (restricted access)</li>
      <li>404 - Not Found</li>
      <li>500 - Internal Server Error</li>
      <li>401 - Unauthorized (triggers logout redirect)</li>
    </ul>
    <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem', fontWeight: 'semibold' }}>
      Features:
    </h4>
    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
      <li>Displays user-friendly error messages</li>
      <li>Go Back button to navigate to previous page</li>
      <li>Take me home button to return to homepage</li>
      <li>Auto-logout on 401 errors</li>
    </ul>
  </Box>
)
