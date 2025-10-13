import { Fragment, useState } from 'react'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { setUserAccessToken } from '@redesignhealth/third-party-network/utils'
import { Alert, Box } from '@redesignhealth/ui'

import { useCurrentUserQuery } from '../hooks'

interface LoginProps {
  onSuccess?: VoidFunction
}

export const Login = ({ onSuccess }: LoginProps) => {
  const { refetch } = useCurrentUserQuery()
  const [isError, setIsError] = useState(false)

  const handleSuccess = async (response: CredentialResponse) => {
    setUserAccessToken(response.credential ?? '')
    const { isSuccess } = await refetch()
    isSuccess ? onSuccess?.() : setIsError(true)
  }

  return (
    <Fragment>
      <Box w="180px">
        <GoogleLogin
          size="medium"
          onSuccess={handleSuccess}
          onError={() => setIsError(true)}
        />
      </Box>
      {isError && (
        <Alert
          status="error"
          color="red.600"
          bgColor="transparent"
          mt="24px"
          p="0"
        >
          We couldn't find a user associated with that Google account. Try
          selecting a different account.
        </Alert>
      )}
    </Fragment>
  )
}
