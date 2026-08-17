import { Meta, StoryFn } from '@storybook/react-vite'

import { Box } from '../box/box'
import { Button } from '../button/button'
import { Flex } from '../flex/flex'
import { Heading } from '../heading/heading'
import { Text } from '../text/text'

// RootBoundary requires React Router's useRouteError hook which is only
// available inside a route errorElement. We render the visual output directly
// to demonstrate the error page UI.

export default {
  title: 'Components / Feedback / RootBoundary',
  decorators: [
    (Story: any) => (
      <Box minH="500px">
        <Story />
      </Box>
    )
  ]
} as Meta

const ErrorDisplay = ({
  statusCode,
  statusText,
  message
}: {
  statusCode: number | string
  statusText: string
  message: string
}) => (
  <Flex
    flexDir="column"
    justify="center"
    p={{ base: '32px', xl: '112px' }}
    h="100%"
  >
    <Heading
      as="h1"
      fontSize="16px"
      lineHeight="24px"
      fontWeight="semibold"
      color="primary.700"
    >
      {statusCode} error
    </Heading>
    <Text
      mt="12px"
      fontSize="60px"
      lineHeight="72px"
      letterSpacing="-0.02em"
      fontWeight="semibold"
      color="gray.900"
    >
      {statusText}
    </Text>
    <Text
      mt="24px"
      fontSize="20px"
      lineHeight="30px"
      fontWeight="normal"
      color="gray.500"
    >
      {message}
    </Text>
    <Flex gap="12px" mt="48px">
      <Button variant="outline" size={{ base: 'md', md: 'lg' }}>
        Go Back
      </Button>
      <Button colorPalette="primary" size={{ base: 'md', md: 'lg' }}>
        Take me home
      </Button>
    </Flex>
  </Flex>
)

export const Error404: StoryFn = () => (
  <ErrorDisplay
    statusCode={404}
    statusText="Not Found"
    message="Sorry, the page you are looking for doesn't exist or has been moved."
  />
)

export const Error403: StoryFn = () => (
  <ErrorDisplay
    statusCode={403}
    statusText="Forbidden"
    message="Sorry, the page you are looking for has restricted access. Please contact your administrator."
  />
)

export const Error400: StoryFn = () => (
  <ErrorDisplay
    statusCode={400}
    statusText="Bad Request"
    message="Sorry, your request resulted in an error. You might not have permission to perform this action."
  />
)

export const Error500: StoryFn = () => (
  <ErrorDisplay
    statusCode={500}
    statusText="Internal Server Error"
    message="Sorry, something went wrong. Please try again or contact support."
  />
)

export const AxiosError: StoryFn = () => (
  <ErrorDisplay
    statusCode={500}
    statusText="Network Error"
    message="Sorry, your request resulted in an error."
  />
)
<<<<<<< HEAD

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
    <h3
      style={{ marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.25rem' }}
    >
      RootBoundary Component
    </h3>
    <p style={{ marginBottom: '0.5rem' }}>
      The RootBoundary component is an error boundary designed to work with
      React Router. It catches routing errors and displays appropriate error
      messages based on the HTTP status code.
    </p>
    <h4
      style={{
        marginTop: '1rem',
        marginBottom: '0.5rem',
        fontWeight: 'semibold'
      }}
    >
      Supported Error Codes:
    </h4>
    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
      <li>400 - Bad Request</li>
      <li>403 - Forbidden (restricted access)</li>
      <li>404 - Not Found</li>
      <li>500 - Internal Server Error</li>
      <li>401 - Unauthorized (triggers logout redirect)</li>
    </ul>
    <h4
      style={{
        marginTop: '1rem',
        marginBottom: '0.5rem',
        fontWeight: 'semibold'
      }}
    >
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
=======
>>>>>>> origin/main
