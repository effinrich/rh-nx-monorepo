import { AlertDescription, AlertRoot, AlertTitle } from '@redesignhealth/ui'

export const ErrorAlert = () => {
  return (
    <AlertRoot
      status="error"
      mt="32px"
      display="block"
      variant="subtle"
      borderLeftWidth="4px"
      borderLeftColor="colorPalette.solid"
    >
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Uh oh. It looks like something went wrong. Please try again in a moment.
      </AlertDescription>
    </AlertRoot>
  )
}
