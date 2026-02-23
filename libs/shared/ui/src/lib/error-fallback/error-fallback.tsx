import { Alert, AlertDescription, AlertIcon, AlertTitle } from '../alert/alert'

interface ErrorFallbackProps {
  error: {
    message: string
  }
  resetErrorBoundary?: () => void
}

export const ErrorFallback = ({
  error,
  resetErrorBoundary
}: ErrorFallbackProps) => {
  return (
    <Alert
      status="error"
      variant="top-accent"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      rounded="md"
      height="250px"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        Something went wrong!
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        Error: {error.message}
        <br />
        Check the console for an error to debug locally. If it is a server
        error, provide details to the API team.
      </AlertDescription>
      {/* <Button onClick={resetErrorBoundary} mt={4} colorPalette="red">
        Sign out and try again
      </Button> */}
    </Alert>
  )
}

export default ErrorFallback
