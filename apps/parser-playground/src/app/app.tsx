import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'
import { Loader } from '@redesignhealth/ui'

import { Home } from './views/home/home'
import { Signin } from './views/sign-in/sign-in'
import {
  RequireAuth,
  RootErrorBoundary
  // RouteErrorBoundary
} from './components'
import Layout from './layout'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/sign-in" element={<Signin />} />
      <Route path="" element={<Layout />} errorElement={<RootErrorBoundary />}>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
          // errorElement={<RouteErrorBoundary />}
        />
      </Route>
    </Route>
  )
)

export function App() {
  return (
    <RouterProvider router={router} fallbackElement={<Loader size="lg" />} />
  )
}

export default App
