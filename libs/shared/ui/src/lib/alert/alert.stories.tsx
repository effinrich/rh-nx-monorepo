import { Box, Container } from '../../index'

import {
  AlertDescription,
  AlertIndicator,
  AlertRoot,
  AlertTitle
} from './alert'

export default {
  title: 'Components / Feedback / Alert',
  decorators: [(story: any) => <Container mt={4}>{story()}</Container>]
}

export const Basic = () => (
  <AlertRoot status="error" variant="solid" borderRadius="md">
    <AlertIndicator />
    <AlertTitle mr={2}>Outdated</AlertTitle>
    <AlertDescription>Your Chakra experience may be degraded.</AlertDescription>
  </AlertRoot>
)

export const Subtle = () => (
  <AlertRoot status="success" mx="auto" alignItems="start">
    <AlertIndicator />
    <Box flex="1">
      <AlertTitle>Holy Smokes</AlertTitle>
      <AlertDescription>Something just happened!</AlertDescription>
    </Box>
  </AlertRoot>
)

export const LeftAccent = () => (
  <AlertRoot
    variant="subtle"
    mx="auto"
    alignItems="start"
    borderStartWidth="3px"
    borderStartColor="colorPalette.solid"
  >
    <AlertIndicator />
    <Box flex="1">
      <AlertTitle>Holy Smokes</AlertTitle>
      <AlertDescription>Something just happened!</AlertDescription>
    </Box>
  </AlertRoot>
)

export const TopAccent = () => (
  <AlertRoot
    variant="subtle"
    mx="auto"
    alignItems="flex-start"
    pt="3"
    rounded="md"
    borderTopWidth="3px"
    borderTopColor="colorPalette.solid"
  >
    <AlertIndicator />
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
      <AlertIndicator />
      There was an error processing your request
    </AlertRoot>
  )
}

export const LoadingExample = () => {
  return (
    <AlertRoot status="loading">
      <AlertIndicator />
      We are loading something
    </AlertRoot>
  )
}

export const WarningExample = () => {
  return (
    <AlertRoot status="warning">
      <AlertIndicator />
      Warning! Something isn't quite right
    </AlertRoot>
  )
}
