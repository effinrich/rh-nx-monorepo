import { Navigate, useLocation } from 'react-router-dom'

import { getIdToken, getTokens } from '../../../utils/auth'

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const idToken = getIdToken()
  const location = useLocation()

  if (!idToken) {
    // Redirect them to the /sign-in page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }

  return children
}

export default RequireAuth
