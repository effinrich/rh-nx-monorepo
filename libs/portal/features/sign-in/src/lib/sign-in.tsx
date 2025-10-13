import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useLocation, useNavigate } from 'react-router-dom'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { setUserAccessToken } from '@redesignhealth/portal/utils'
import { Flex, Image, Stack, Text } from '@redesignhealth/ui'

import BackgroundImage from './assets/background.jpeg'
import RedesignHealthPrism from './assets/redesign-health-prism.svg'
import RedesignHealthText from './assets/redesign-health-text.svg'

export const SignIn = () => {
  const [isError, setIsError] = useState<boolean>(false)
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname ?? '/'

  const errorMessage = `We couldn't find a user associated with that Google account. Try selecting a different account.`

  const handleToken = (response: CredentialResponse) => {
    const jwt = response.credential as string
    setUserAccessToken(jwt)
    navigate(from, { replace: true })
  }

  return (
    <Flex
      as="main"
      h="100%"
      backgroundImage={BackgroundImage}
      backgroundSize="cover"
      justify="center"
    >
      <Helmet>
        <title>Sign in</title>
      </Helmet>
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
          <GoogleLogin
            auto_select
            onSuccess={credentialResponse => {
              setIsError(false)
              handleToken(credentialResponse)
            }}
            onError={() => {
              setIsError(true)
            }}
          />
          {isError && (
            <Text
              borderRadius="md"
              fontSize="md"
              color="red.500"
              align="center"
            >
              {errorMessage}
            </Text>
          )}
        </Stack>
      </Flex>
    </Flex>
  )
}
