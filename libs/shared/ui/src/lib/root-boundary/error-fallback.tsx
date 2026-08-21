import { useEffect, useState } from 'react'
import { MdArrowBack } from 'react-icons/md'
import { isRouteErrorResponse, Link, useNavigate } from 'react-router-dom'

import { Button } from '../button/button'
import { Flex } from '../flex/flex'
import { Heading } from '../heading/heading'
import { Text } from '../text/text'

import type { ErrorFallbackProps } from './error-fallback-props'

export function ErrorFallback({
  error
}: {
  error: ErrorFallbackProps['error']
}) {
  const [errorMessage, setErrorMessage] = useState<string>()
  const navigate = useNavigate()

  useEffect(() => {
    if (isRouteErrorResponse(error)) {
      if (error.status === 400) {
        setErrorMessage(
          `Sorry, your request resulted in an error. You might not have permission to perform this action.`
        )
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

      <Flex gap="12px" mt="48px">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          size={{ base: 'md', md: 'lg' }}
        >
          <MdArrowBack />
          Go Back
        </Button>
        <Button asChild colorPalette="primary" size={{ base: 'md', md: 'lg' }}>
          <Link to="/" replace>
            Take me home
          </Link>
        </Button>
      </Flex>
    </Flex>
  )
}
