import { useEffect, useState } from 'react'
import { MdArrowBack } from 'react-icons/md'
import {
  isRouteErrorResponse,
  Link,
  useLocation,
  useNavigate,
  useRouteError
} from 'react-router-dom'

import { Button } from '../button/button'
import { Flex } from '../flex/flex'
import { Heading } from '../heading/heading'
import { Text } from '../text/text'

export interface ErrorFallbackProps {
  error: {
    name?: string
    statusText?: string
    status?: number
    message?: string
    data?: {
      message?: string
    }
    response?: Record<string, any>
  }

  statusText?: string
  message?: string
  status?: number
  data?: {
    message?: string
  }
  response?: Record<string, any>
}

const ErrorFallback = ({ error }: ErrorFallbackProps) => {
  const [errorMessage, setErrorMessage] = useState<string>()
  const navigate = useNavigate()

  useEffect(() => {
    if (isRouteErrorResponse(error)) {
      if (error.status === 400) {
        // NOTE: The 400 error code message may need to be updated in the future when we have the
        // ability to test appropriately (see https://redesignhealth.atlassian.net/browse/PDEV-90)
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
          leftIcon={<MdArrowBack />}
          onClick={() => navigate(-1)}
          size={{ base: 'md', md: 'lg' }}
        >
          Go Back
        </Button>
        <Button
          as={Link}
          to="/"
          replace
          colorScheme="primary"
          size={{ base: 'md', md: 'lg' }}
        >
          Take me home
        </Button>
      </Flex>
    </Flex>
  )
}

export function RootBoundary({ logout }: any) {
  const error = useRouteError() as ErrorFallbackProps
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (error.response?.status === 401 || error.status === 401) {
      logout(() => {
        navigate('/sign-in', { state: { from: location }, replace: true })
      })
    }
  }, [logout, error.response?.status, error.status, navigate, location])

  return <ErrorFallback error={error} />
}

export default RootBoundary
