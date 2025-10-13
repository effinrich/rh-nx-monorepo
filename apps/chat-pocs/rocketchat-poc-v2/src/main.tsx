import { lazy } from 'react'
import * as ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { RhProvider, theme } from '@redesignhealth/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import 'react-toastify/dist/ReactToastify.css'

const App = lazy(() => import('./app/app'))

// const GOOGLE_CLIENT_ID = process.env.NX_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_ID =
  '510999103231-uh3e7jk8dkuia2omhesn1m577eqmnce9.apps.googleusercontent.com'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0
    }
  }
})

const root = ReactDOM.createRoot(document.querySelector('#root')!)
root.render(
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ''}>
      <RhProvider theme={theme}>
        <App />
        <ToastContainer newestOnTop />
      </RhProvider>
    </GoogleOAuthProvider>
  </QueryClientProvider>
)
