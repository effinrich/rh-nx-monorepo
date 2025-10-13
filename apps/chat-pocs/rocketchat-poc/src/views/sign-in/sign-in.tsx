import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CodeResponse,
  CredentialResponse,
  GoogleLogin,
  TokenResponse,
  useGoogleLogin
} from '@react-oauth/google'
import {
  /* Button,*/ Button,
  Flex,
  Image,
  Stack,
  Text
} from '@redesignhealth/ui'
import axios from 'axios'

import BackgroundImage from '../../assets/background.jpeg'
import RedesignHealthPrism from '../../assets/redesign-health-prism.svg'
import RedesignHealthText from '../../assets/redesign-health-text.svg'
import { setIdToken, setTokens } from '../../utils/auth'

export const SignIn = () => {
  // const [codeResponse, setCodeResponse] = useState<CodeResponse | null>()
  const [isError, setIsError] = useState<boolean>(false)
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname ?? '/'

  const errorMessage = `We couldn't find a user associated with that Google account. Try selecting a different account.`

  // const handleToken = (response: CredentialResponse) => {
  //   const jwt = response.credential as string
  //   setIdToken(jwt)
  //   navigate(from, { replace: true })
  // }
  // const errorMessage = `We couldn't find a user associated with that Google account. Try selecting a different account.`

  // const googleLogin = useGoogleLogin({
  //   onSuccess: async (tokenResponse: TokenResponse) => {
  //     const userInfo = await axios
  //       .get('https://www.googleapis.com/oauth2/v3/userinfo', {
  //         headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
  //       })
  //       .then(res => res.data)

  //     console.log('tokenResponse = ', tokenResponse)
  //     console.log('userInfo = ', userInfo)
  //     setAccessToken(tokenResponse.access_token)
  //     navigate(from, { replace: true })
  //   },
  //   onError: errorResponse => console.log(errorResponse)
  // })

  // const googleLogin = useGoogleLogin({
  //   onSuccess: async ({ code }) => {
  //     console.log(`UI POC has code ${code}`)
  //     const tokens = await axios.post('/api/auth/google', {
  //       code
  //     })

  //     console.log(`UI POC has tokens.`)
  //     console.log(tokens)

  //     setTokens(JSON.stringify(tokens))
  //     navigate(from, { replace: true })
  //   },
  //   flow: 'auth-code'
  // })

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
          {/*
          <Button onClick={() => googleLogin()} colorScheme="primary">
            Google Auth-Flow Login
          </Button>
          */}
          <GoogleLogin
            auto_select
            onSuccess={credentialResponse => {
              if (!credentialResponse.credential) {
                setIsError(true)
                return
              }
              setIsError(false)
              setIdToken(credentialResponse.credential)
              navigate(from, { replace: true })
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
