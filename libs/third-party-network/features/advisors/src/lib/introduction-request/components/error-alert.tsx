import { Alert, AlertDescription, AlertTitle } from '@redesignhealth/ui'

export const ErrorAlert = () => {
  return (
    <Alert status="error" mt="32px" display="block" variant="left-accent">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Uh oh. It looks like something went wrong. Please try again in a moment.
      </AlertDescription>
    </Alert>
  )
}
