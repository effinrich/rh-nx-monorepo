import { AlertIndicator, AlertRoot } from '../alert'

export function DocsExampleAlert() {
  return (
    <AlertRoot status="error">
      <AlertIndicator />
      There was an error processing your request
    </AlertRoot>
  )
}
