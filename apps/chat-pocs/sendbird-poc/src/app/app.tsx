/* eslint-disable no-console */
import React, { useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { Box } from '@redesignhealth/ui'
import { Channel, ChannelList } from '@sendbird/uikit-react'
import SessionHandler from '@sendbird/uikit-react/handlers/SessionHandler'
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'

import '@sendbird/uikit-react/dist/index.css'

const StyledApp = styled(Box)`
  height: 100vh;
  display: flex;
  .sendbird-app__conversation-wrap {
    flex: 1;
  }

  /* Cheap trick to hide info button */
  .sendbird-chat-header__right__info {
    display: none;
  }
`
// Add client app info.
const appInfo = {
  appId: '4E1E2DBE-4293-47E2-9F67-9E630BAA704A',
  apiToken: 'e58ce0dbf298983cffaecfbb0d78d2bcc4627e71',
  userId: '194589'
}
const configureSession = () => {
  const sessionHandler = new SessionHandler()
  sessionHandler.onSessionTokenRequired = (resolve, reject) => {
    issueSessionToken()
      .then(token => {
        // When using access token, set `currentUserInfo.accessToken` to `token`.
        resolve(token)
      })
      .catch(err => reject(err))
  }
  sessionHandler.onSessionRefreshed = () => {
    console.log('🚨 SessionHandler.onSessionRefreshed()')
  }
  sessionHandler.onSessionError = err => {
    console.log('🚨 SessionHandler.onSessionError()', err)
  }
  sessionHandler.onSessionClosed = () => {
    console.log('🚨 SessionHandler.onSessionClosed()')
  }
  return sessionHandler
}
const issueSessionToken = async () => {
  const endpoint = `https://api-${appInfo.appId}.sendbird.com/v3/users/${appInfo.userId}/token`
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Api-Token': appInfo.apiToken,
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({
      expires_at: Date.now() + 60000 // 1 minute from now
    })
  })
  const result = await response.json()
  console.log('✅', result)
  return result.token
}
function App() {
  const [tkn, setTkn] = useState<string | undefined>()
  useEffect(() => {
    if (!tkn) {
      console.warn('inside')
      const initiateSession = async () => {
        const token = await issueSessionToken()
        setTkn(token)
      }
      initiateSession()
    }
  }, [tkn])
  const [currentChannelUrl, setCurrentChannelUrl] = React.useState('')
  const thing = useMemo(() => configureSession, [])
  if (!tkn) {
    return null
  }
  console.log(tkn)
  return (
    <StyledApp>
      <SendbirdProvider
        appId={appInfo.appId}
        userId={appInfo.userId}
        accessToken={tkn}
        config={{ logLevel: 'all' }}
        configureSession={thing}
      >
        {
          (
            <>
              <div className="sendbird-app__channellist-wrap">
                <ChannelList
                  onChannelSelect={channel => {
                    if (channel?.url) {
                      setCurrentChannelUrl(channel.url)
                    }
                  }}
                />
              </div>
              <div className="sendbird-app__conversation-wrap">
                <Channel channelUrl={currentChannelUrl} />
              </div>
            </> // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ) as any
        }
      </SendbirdProvider>
    </StyledApp>
  )
}
export default App
