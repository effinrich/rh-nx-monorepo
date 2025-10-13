import { PropsWithChildren } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'

type AuthProviderProps = PropsWithChildren

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  )
}
