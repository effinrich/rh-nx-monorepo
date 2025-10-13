/* eslint-disable no-console */
import { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
/* eslint-disable unicorn/prefer-top-level-await */
import {
  CometChatUIKit,
  CometChatUsersWithMessages
} from '@cometchat/chat-uikit-react'
// import { Route, Routes, Link } from 'react-router-dom'
import { UIKitSettingsBuilder } from '@cometchat/uikit-shared'

import FullScreenLoader from '../components/fullscreen-loader'
import { CometChatConstants } from '../constants'

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const initCometChat = async () => {
      const uiKitSettings = new UIKitSettingsBuilder()
        .setAppId(CometChatConstants.APP_ID)
        .setRegion(CometChatConstants.REGION)
        .setAuthKey(CometChatConstants.AUTH_KEY)
        .subscribePresenceForFriends()
        .build()
      try {
        await CometChatUIKit?.init(uiKitSettings)

        await CometChatUIKit?.getLoggedinUser()
          .then(user => {
            if (user) {
              setIsLoggedIn(true)
            } else {
              const handleLogin = async () => {
                await CometChatUIKit.login(CometChatConstants.uid).then(() => {
                  console.log('Login Successful:', { user })
                  setIsLoggedIn(true)
                })
              }
              handleLogin()
            }
          })
          .catch(console.log)
      } catch (error) {
        console.log('Initialization failed with error:', error)
      }
    }

    initCometChat()
  }, [])

  return (
    <Box>
      {isLoggedIn ? <CometChatUsersWithMessages /> : <FullScreenLoader />}
    </Box>
  )
}

export default App
