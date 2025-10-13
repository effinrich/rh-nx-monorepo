import { lazy, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Button } from '@chakra-ui/react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'

import FullScreenLoader from '../components/fullscreen-loader'

// import { NotificationCenter } from '../components/notification-center/notification-center'
import 'react-toastify/dist/ReactToastify.css'

const SignIn = lazy(() => import('../views/sign-in/sign-in'))
const Chat = lazy(() => import('../views/chat/chat'))
const RequireAuth = lazy(
  () => import('../views/sign-in/require-auth/require-auth')
)

export function App() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div>
              There was an error!{' '}
              <Button onClick={() => resetErrorBoundary()}>Try again</Button>
              <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
            </div>
          )}
          onReset={reset}
        >
          <Suspense fallback={<FullScreenLoader />}>
            <BrowserRouter>
              <Routes>
                <Route path="sign-in" element={<SignIn />} />
                <Route
                  path="/"
                  element={
                    <RequireAuth>
                      <Chat />
                    </RequireAuth>
                  }
                />
              </Routes>
              {/* <NotificationCenter /> */}
            </BrowserRouter>
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

export default App
