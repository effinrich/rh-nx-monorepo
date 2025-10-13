import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
// import { GoogleOAuthProvider } from '@react-oauth/google'
import { RhProvider, theme } from '@redesignhealth/ui'

import App from './app/app'
const GOOGLE_CLIENT_ID =
  '510999103231-emldsjte0kvs5oee7gtleoqsfhtqc3ge.apps.googleusercontent.com'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <RhProvider theme={theme}>
          <App />
        </RhProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
)
