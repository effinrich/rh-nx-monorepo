import { Box, Container } from '../../index'

import { Alert, AlertDescription, AlertIcon, AlertTitle } from './alert'

export default {
  title: 'Components / Feedback / Alert',
  decorators: [(story: any) => <Container mt={4}>{story()}</Container>]
}

export const Basic = () => (
  <Alert status="error" variant="solid" borderRadius="md">
    <AlertIcon />
    <AlertTitle mr={2}>Outdated</AlertTitle>
    <AlertDescription>Your Chakra experience may be degraded.</AlertDescription>
  </Alert>
)

export const Subtle = () => (
  <Alert status="success" mx="auto" alignItems="start">
    <AlertIcon />
    <Box flex="1">
      <AlertTitle>Holy Smokes</AlertTitle>
      <AlertDescription>Something just happened!</AlertDescription>
    </Box>
  </Alert>
)

export const LeftAccent = () => (
  <Alert variant="left-accent" mx="auto" alignItems="start">
    <AlertIcon />
    <Box flex="1">
      <AlertTitle>Holy Smokes</AlertTitle>
      <AlertDescription>Something just happened!</AlertDescription>
    </Box>
  </Alert>
)

export const TopAccent = () => (
  <Alert
    variant="top-accent"
    mx="auto"
    alignItems="flex-start"
    pt="3"
    rounded="md"
  >
    <AlertIcon />
    <Box flex="1">
      <AlertTitle display="block" mr="2">
        Holy Smokes
      </AlertTitle>
      <AlertDescription>Something just happened!</AlertDescription>
    </Box>
  </Alert>
)

export const DocsExample = () => {
  return (
    <Alert status="error">
      <AlertIcon />
      There was an error processing your request
    </Alert>
  )
}

export const LoadingExample = () => {
  return (
    <Alert status="loading">
      <AlertIcon />
      We are loading something
    </Alert>
  )
}

export const WarningExample = () => {
  return (
    <Alert status="warning">
      <AlertIcon />
      Warning! Something isn't quite right
    </Alert>
  )
}
