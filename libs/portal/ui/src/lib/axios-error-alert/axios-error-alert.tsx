import { type ApiError } from '@redesignhealth/portal/data-assets'
import {
  type BoxProps,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Text
} from '@redesignhealth/ui'

interface AxiosErrorAlertProps extends BoxProps {
  error?: ApiError | string
}

export const AxiosErrorAlert = ({ error, ...props }: AxiosErrorAlertProps) => {
  return (
    <Alert
      status="error"
      variant="left-accent"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      rounded="sm"
      {...props}
    >
      <Box flexDirection="row" display="flex">
        <AlertIcon mr={2} />
        <AlertTitle fontSize="md">
          {(() => {
            if (typeof error === 'string') {
              return `Error: ${error}`
            } else if (error && error.message) {
              return `Error: ${error.message}`
            } else {
              return 'Problem with request...'
            }
          })()}
        </AlertTitle>
      </Box>

      <AlertDescription>
        {typeof error !== 'string' &&
          error?.errors?.map(err => (
            <Box key={err.name} textAlign="right">
              <Text as="span" textTransform="capitalize">
                {err.name}{' '}
              </Text>
              <Text as="span">{err.description}</Text>
            </Box>
          ))}
      </AlertDescription>
    </Alert>
  )
}

export default AxiosErrorAlert
