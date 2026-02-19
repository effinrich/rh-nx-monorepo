import ReactDOM from 'react-dom/client'
import ReactGA from 'react-ga4'
import Hotjar from '@hotjar/browser'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { RhProvider, theme } from '@redesignhealth/ui'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { directQueryClient } from './api/react-query'
import App from './app/app'

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

if (GA_MEASUREMENT_ID) {
  ReactGA.initialize(GA_MEASUREMENT_ID, {
    gtagOptions: {
      send_page_view: false
    }
  })
}

const siteId = import.meta.env.VITE_HOTJAR_ID
const hotjarVersion = 6

if (siteId) {
  Hotjar.init(siteId, hotjarVersion)
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={directQueryClient()}>
      <ReactQueryDevtools buttonPosition="bottom-right" />
      <RhProvider value={theme} enablecolorPalette={undefined}>
        <App />
      </RhProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
)
