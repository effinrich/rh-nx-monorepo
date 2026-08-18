import { AlertRoot, AlertDescription, AlertIndicator, AlertTitle } from '../alert/alert'

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
    <AlertRoot
      status="error"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      rounded="md"
      height="250px"
    >
      <AlertIndicator boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        Something went wrong!
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        Error: {error.message}
        <br />
        Check the console for an error to debug locally. If it is a server
        error, provide details to the API team.
      </AlertDescription>
    </AlertRoot>
  )
}

export default ErrorFallback
