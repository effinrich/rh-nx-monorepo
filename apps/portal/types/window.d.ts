import Google from '@types/google-one-tap'

declare global {
  interface Window {
    google?: typeof Google
  }
}
