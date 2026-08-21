import { Meta } from '@storybook/react-vite'

import { Box } from '../box/box'

import { ErrorDisplay } from './partials/error-display'
import { RootBoundary } from './root-boundary'

export default {
  component: RootBoundary,
  title: 'Components / Feedback / RootBoundary',
  decorators: [
    (Story: () => unknown) => (
      <Box minH="500px">
        <Story />
      </Box>
    )
  ]
} as Meta<typeof RootBoundary>

export const Error404 = {
  render: () => (
    <ErrorDisplay
      statusCode={404}
      statusText="Not Found"
      message="Sorry, the page you are looking for doesn't exist or has been moved."
    />
  )
}

export const Error403 = {
  render: () => (
    <ErrorDisplay
      statusCode={403}
      statusText="Forbidden"
      message="Sorry, the page you are looking for has restricted access. Please contact your administrator."
    />
  )
}

export const Error400 = {
  render: () => (
    <ErrorDisplay
      statusCode={400}
      statusText="Bad Request"
      message="Sorry, your request resulted in an error. You might not have permission to perform this action."
    />
  )
}

export const Error500 = {
  render: () => (
    <ErrorDisplay
      statusCode={500}
      statusText="Internal Server Error"
      message="Sorry, something went wrong. Please try again or contact support."
    />
  )
}

export const AxiosError = {
  render: () => (
    <ErrorDisplay
      statusCode={500}
      statusText="Network Error"
      message="Sorry, your request resulted in an error."
    />
  )
}
