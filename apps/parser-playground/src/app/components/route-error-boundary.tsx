import { useEffect } from 'react'
import {
  isRouteErrorResponse,
  useLocation,
  useNavigate,
  useRouteError
} from 'react-router-dom'
import { ApiError } from '@redesignhealth/portal/data-assets'
import { Box, Button, Flex, Heading, Text } from '@redesignhealth/ui'
import {  AxiosResponse } from 'axios'

import { logout } from '../store'

interface ErrorFallbackProps extends Error {
  error: {
    name?: string
    statusText?: string
    status?: number
    message?: string
    data?: {
      message?: string
    }
    response?: AxiosResponse<ApiError>
  }
  name: string
  statusText?: string
  message: string
  status?: number
  data?: {
    message?: string
  }
  response?: AxiosResponse<ApiError>
}

export const RouteErrorBoundary = () => {
  const error = useRouteError() as ErrorFallbackProps
  const navigate = useNavigate()
  const location = useLocation()
  // We only care to handle 401's at this level, so if this is not a 401
  // ErrorResponse, re-throw to let the RootErrorBoundary handle it
  // console.log(isRouteErrorResponse(error))
  // console.log(!isRouteErrorResponse(error) || error.status !== 401)
  // if (error?.response?.status !== 401) {
  //   throw error
  // }

  useEffect(() => {
    if (error.response?.status === 401 || error.status === 401) {
      logout(() => {
        navigate('/sign-in', { state: { from: location }, replace: true })
      })
    } else {
      throw error
    }
  }, [error.response?.status, error.status, navigate, location, error])

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
          : `${error?.response?.status} error`}
      </Heading>
      <Text
        mt="12px"
        fontSize="24px"
        lineHeight="72px"
        letterSpacing="-0.02em"
        fontWeight="semibold"
        color="gray.900"
      >
        {isRouteErrorResponse(error)
          ? `${error.statusText}`
          : `${error.message}`}
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

export default RouteErrorBoundary
