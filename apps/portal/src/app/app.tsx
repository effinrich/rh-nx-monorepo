import { Helmet } from 'react-helmet'
import { RouterProvider } from 'react-router-dom'
import analytics from '@redesignhealth/analytics'
import { Loader } from '@redesignhealth/ui'
import { SpeedInsights } from '@vercel/speed-insights/react'

import { router } from '../router'

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose())
}

/**
 * Analytics Page Views:
 * We'll manually manage page views in our app to ensure document titles
 * with async information are sent to our analytics service only after the title has been
 * updated properly.
 *
 * We do this by leveraging Helmet's onChangeClientState which listens to changes
 * in the <head />.
 *
 * We'll ensure our titles are only registered when dynamic data is loaded.
 * {dynamicData && <Helmet><title>{dynamicData}</title></Helmet>}
 */

export function App() {
  const sendPageViewListener = (documentTitle: string) => {
    if (documentTitle) {
      analytics.sendPageView()
    }
  }

  return (
    <>
      <Helmet
        onChangeClientState={newState => sendPageViewListener(newState.title)}
      />
      <SpeedInsights />
      <RouterProvider router={router} fallbackElement={<Loader size="lg" />} />
    </>
  )
}

export default App
