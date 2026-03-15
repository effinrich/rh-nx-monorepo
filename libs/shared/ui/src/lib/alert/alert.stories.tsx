import { Box, Container } from '../../index'

import { AlertRoot, AlertDescription, AlertIcon, AlertTitle } from './alert'

export default {
  title: 'Components / Feedback / Alert',
  decorators: [(story: any) => <Container mt={4}>{story()}</Container>]
}

export const Basic = () => (
  <AlertRoot status="error" variant="solid" borderRadius="md">
    <AlertIcon />
    <AlertTitle mr={2}>Outdated</AlertTitle>
    <AlertDescription>Your Chakra experience may be degraded.</AlertDescription>
  </AlertRoot>
)

export const Subtle = () => (
  <AlertRoot status="success" mx="auto" alignItems="start">
    <AlertIcon />
    <Box flex="1">
      <AlertTitle>Holy Smokes</AlertTitle>
      <AlertDescription>Something just happened!</AlertDescription>
    </Box>
  </AlertRoot>
)

export const LeftAccent = () => (
  <AlertRoot variant="left-accent" mx="auto" alignItems="start">
    <AlertIcon />
    <Box flex="1">
      <AlertTitle>Holy Smokes</AlertTitle>
      <AlertDescription>Something just happened!</AlertDescription>
    </Box>
  </AlertRoot>
)

export const TopAccent = () => (
  <AlertRoot
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
  </AlertRoot>
)

export const DocsExample = () => {
  return (
    <AlertRoot status="error">
      <AlertIcon />
      There was an error processing your request
    </AlertRoot>
  )
}

export const LoadingExample = () => {
  return (
    <AlertRoot status="loading">
      <AlertIcon />
      We are loading something
    </AlertRoot>
  )
}

export const WarningExample = () => {
  return (
    <AlertRoot status="warning">
      <AlertIcon />
      Warning! Something isn't quite right
    </AlertRoot>
  )
}
