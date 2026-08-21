import { Box } from '../../box/box'
import {
  AlertDescription,
  AlertIndicator,
  AlertRoot,
  AlertTitle
} from '../alert'

export function LeftAccentAlert() {
  return (
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
}
