import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Flex, Image, Stack, Text } from '@chakra-ui/react'
import { ErrorCode, useGoogleLogin } from '@react-oauth/google'

import BackgroundImage from '../../assets/background.jpeg'
import RedesignHealthPrism from '../../assets/redesign-health-prism.svg'
import RedesignHealthText from '../../assets/redesign-health-text.svg'
import api from '../../utils/api'
import { getAccessToken, setTokens } from '../../utils/auth'

export const SignIn = () => {
  const accessToken = getAccessToken()
  const [authError, setAuthError] = useState<ErrorCode>()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname ?? '/'

  const handleRedirectOnSuccess = useCallback(() => {
    navigate(from, { replace: true })
  }, [from, navigate])

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    scope: 'profile email openid',
    onSuccess: async codeResponse => {
      // POST to express proxy backend
      const { data } = await api.post('/api/auth/google', {
        code: codeResponse.code
      })

      setTokens(data)

      handleRedirectOnSuccess()
    },
    onError: errorResponse => {
      setAuthError(errorResponse.error)
    }
  })

  useEffect(() => {
    if (accessToken) {
      handleRedirectOnSuccess()
    }
  }, [accessToken, handleRedirectOnSuccess])

  return (
    <Flex
      as="main"
      h="100vh"
      backgroundImage={BackgroundImage}
      backgroundSize="cover"
      justify="center"
    >
      <Flex direction="column" justify="center">
        <Stack
          maxW="400px"
          spacing={6}
          background="white"
          align="center"
          borderRadius="md"
          px={14}
          py={12}
        >
          <Image src={RedesignHealthPrism} />
          <Image src={RedesignHealthText} />
          <Text color="gray.600">Welcome! Sign into your account.</Text>

          <Button
            onClick={() => googleLogin()}
            colorScheme="purple"
            variant="solid"
          >
            Google Auth-Flow Login
          </Button>

          {authError && (
            <Text
              borderRadius="md"
              fontSize="md"
              color="red.500"
              align="center"
            >
              {authError}
            </Text>
          )}
        </Stack>
      </Flex>
    </Flex>
  )
}

export default SignIn
