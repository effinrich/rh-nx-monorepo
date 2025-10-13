import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text
} from '@redesignhealth/ui'

import { getUserToken, setUserToken } from '../../store'

export const Signin = () => {
  const [isError, setIsError] = useState<boolean>(false)
  const navigate = useNavigate()
  const location = useLocation()
  const accessToken = getUserToken()

  const from = location.state?.from?.pathname || '/'

  const errorMessage = ` We couldn't find a user associated with that Google account. Try selecting a different account.`

  const handleToken = (response: CredentialResponse) => {
    const jwt = response.credential as string
    setUserToken(jwt)
    navigate(from, { replace: true })
  }

  useEffect(() => {
    if (accessToken) {
      navigate(from, { replace: true })
    }
  }, [accessToken, from, navigate])

  return (
    <Box mt={24} mx="auto" maxW="950px">
      <Card variant="elevated">
        <CardHeader pb={0}>
          <Heading size="sm">Sign In</Heading>
        </CardHeader>
        <CardBody>
          <GoogleLogin
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
              fontSize="16px"
              lineHeight="24px"
              color="red.500"
              mt="24px"
              maxW="360px"
            >
              {errorMessage}
            </Text>
          )}
        </CardBody>
      </Card>
    </Box>
  )
}

export default Signin
