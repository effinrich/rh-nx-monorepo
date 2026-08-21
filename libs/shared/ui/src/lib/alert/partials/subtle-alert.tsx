import { Box } from '../../box/box'
import {
  AlertDescription,
  AlertIndicator,
  AlertRoot,
  AlertTitle
} from '../alert'

export function SubtleAlert() {
  return (
    <AlertRoot status="success" mx="auto" alignItems="start">
      <AlertIndicator />
      <Box flex="1">
        <AlertTitle>Holy Smokes</AlertTitle>
        <AlertDescription>Something just happened!</AlertDescription>
      </Box>
    </AlertRoot>
  )
}
