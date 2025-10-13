import { useEffect, useState } from 'react'
import { EmbeddedChat } from '@embeddedchat/react'
import { useGoogleLogin } from '@react-oauth/google'
import { Loader } from '@redesignhealth/ui'

// import { rh } from '@redesignhealth/ui'
import { getAccessToken, getIdToken, setAccessToken } from '../../utils/auth'
// const RhEmbeddedChat = rh(EmbeddedChat)

export function Chat() {
  //const [idToken, _] = useState(getIdToken())
  //const [accessToken, setAccessTokenInState] = useState<string | undefined>(
  //  getAccessToken() || undefined
  //)
  const idToken = getIdToken()
  const accessToken = getAccessToken()
  const libraryStyleLogin = useGoogleLogin({
    flow: 'implicit',
    scope: 'email profile openid',
    prompt: '',
    onSuccess: ({ access_token }) => {
      setAccessToken(access_token)
      //setAccessTokenInState(access_token)
    }
  })

  useEffect(() => {
    if (!accessToken) {
      libraryStyleLogin()
    }
  })
  console.log({ idToken, accessToken })
  if (!accessToken) {
    return <Loader />
  }
  return (
    <EmbeddedChat
      host="https://rocketchat-poc.dev.redesignhealth.com"
      roomId="GENERAL"
      auth={{
        flow: 'TOKEN',
        credentials: {
          serviceName: 'google',
          idToken,
          accessToken,
          expiresIn: 3600
        }
      }}
    />
  )
}

export default Chat
