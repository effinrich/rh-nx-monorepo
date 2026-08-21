import { AlertIndicator, AlertRoot } from '../alert'

export function WarningExampleAlert() {
  return (
    <AlertRoot status="warning">
      <AlertIndicator />
      Warning! Something isn't quite right
    </AlertRoot>
  )
}
