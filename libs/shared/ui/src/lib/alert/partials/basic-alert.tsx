import {
  AlertDescription,
  AlertIndicator,
  AlertRoot,
  AlertTitle
} from '../alert'

export function BasicAlert() {
  return (
    <AlertRoot status="error" variant="solid" borderRadius="md">
      <AlertIndicator />
      <AlertTitle mr={2}>Outdated</AlertTitle>
      <AlertDescription>
        Your Chakra experience may be degraded.
      </AlertDescription>
    </AlertRoot>
  )
}
