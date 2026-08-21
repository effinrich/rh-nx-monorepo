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
