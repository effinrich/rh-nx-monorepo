import { useEffect, useState } from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Box, Button, Flex, Heading, Text } from '@redesignhealth/ui'

export interface ErrorFallbackProps {
  error: {
    name?: string
    statusText?: string
    status?: number
    message?: string
    data?: {
      message?: string
    }
    response?: Record<string, string>
  }
  name?: string
  statusText?: string
  message?: string
  status?: number
  data?: {
    message?: string
  }
  response?: Record<string, string>
}

export function RootErrorBoundary() {
  const error = useRouteError() as ErrorFallbackProps

  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    if (isRouteErrorResponse(error)) {
      if (error.status === 400) {
        setErrorMessage(`Sorry, your request resulted in an error.`)
      }

      if (error.status === 403) {
        setErrorMessage(
          `Sorry, the page you are looking for has restricted access. Please
        contact your administrator.`
        )
      }

      if (error.status === 404) {
        setErrorMessage(
          `Sorry, the page you are looking for doesn't exist or has been moved.`
        )
      }

      if (error.status === 500) {
        setErrorMessage(
          `Sorry, something went wrong. Please try again or contact support.`
        )
      }
    } else if (error?.name === 'AxiosError') {
      setErrorMessage(`Sorry, your request resulted in an error.`)
    } else {
      setErrorMessage(
        `Sorry, something went wrong. Please try again or contact support.`
      )
    }
  }, [error])

  return (
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
        {isRouteErrorResponse(error)
          ? `${error.status} error`
          : `${error.response?.status} error`}
      </Heading>
      <Text
        mt="12px"
        fontSize="60px"
        lineHeight="72px"
        letterSpacing="-0.02em"
        fontWeight="semibold"
        color="gray.900"
      >
        {isRouteErrorResponse(error)
          ? `${error.statusText}`
          : `${error.message}`}
      </Text>
      <Text
        mt="24px"
        fontSize="20px"
        lineHeight="30px"
        fontWeight="normal"
        color="gray.500"
      >
        {errorMessage}
      </Text>

      <Box mt="48px">
        <Button
          onClick={() => (window.location.href = '/')}
          colorScheme="primary"
          size={{ base: 'md', md: 'lg' }}
        >
          Click here to reload the app
        </Button>
      </Box>
    </Flex>
  )
}

export default RootErrorBoundary
