import { AlertIndicator, AlertRoot } from '../alert'

export function LoadingExampleAlert() {
  return (
    <AlertRoot status="loading">
      <AlertIndicator />
      We are loading something
    </AlertRoot>
  )
}
