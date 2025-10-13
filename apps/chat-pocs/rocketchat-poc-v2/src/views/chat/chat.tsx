import { EmbeddedChat } from '@embeddedchat/react'
import { Box } from '@redesignhealth/ui'

import FullScreenLoader from '../../components/fullscreen-loader'
import { getAccessToken, getExpiryDate, getIdToken } from '../../utils/auth'

export function Chat() {
  const idToken = getIdToken()
  const accessToken = getAccessToken()
  //const expiryDate = getExpiryDate()

  return (
    <Box>
      {accessToken ? (
        <EmbeddedChat
          host="https://rocketchat-poc.dev.redesignhealth.com"
          roomId="GENERAL"
          channelName="GENERAL"
          anonymousMode
          enableThreads
          auth={{
            flow: 'TOKEN',
            credentials: {
              serviceName: 'google',
              expiresIn: 3600,
              accessToken,
              idToken
            }
          }}
        />
      ) : (
        <FullScreenLoader />
      )}
    </Box>
  )
}

export default Chat
