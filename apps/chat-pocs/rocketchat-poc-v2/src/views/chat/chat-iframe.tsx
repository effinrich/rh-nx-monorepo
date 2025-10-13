import { AspectRatio } from '@chakra-ui/react'

// // const GOOGLE_CLIENT_ID = process.env.NX_GOOGLE_CLIENT_ID
// const GOOGLE_CLIENT_ID =
//   '801513262826-sl8qdthjt6i8ifkci8s4ndhop8u7htr7.apps.googleusercontent.com'

export function Chat() {
  // window.parent.postMessage(
  //   {
  //     event: 'call-google-login',
  //     scopes: 'email profile openid',
  //     webClientId: GOOGLE_CLIENT_ID
  //   },
  //   'https://portal-chat.rocket.chat'
  // )
  window.addEventListener('message', function (e) {
    console.log(e.data.eventName) // event name
    console.log(e.data.data) // event data
  })

  document?.querySelector('iframe')?.contentWindow?.postMessage(
    {
      externalCommand: 'login-with-token',
      path: 'https://rocketchat-poc.dev.redesignhealth.com/api/v1/login'
    },
    '*'
  )

  document?.querySelector('iframe')?.contentWindow?.postMessage(
    {
      externalCommand: 'go',
      path: '/admin/General'
    },
    '*'
  )

  document?.querySelector('iframe')?.contentWindow?.postMessage(
    {
      externalCommand: 'userSetStatus',
      status: 'away'
    },
    '*'
  )

  return (
    <AspectRatio maxWidth="1920px" ratio={16 / 9} id="iframe">
      <iframe
        // src="https://portal-chat.rocket.chat/directory/channels?layout=embedded"
        src="https://portal-chat.rocket.chat/channel/general?layout=embedded"
        title="demo"
      />
    </AspectRatio>
  )
}

export default Chat
