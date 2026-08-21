import { Box } from '../../box/box'
import {
  AlertDescription,
  AlertIndicator,
  AlertRoot,
  AlertTitle
} from '../alert'

export function TopAccentAlert() {
  return (
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
}
