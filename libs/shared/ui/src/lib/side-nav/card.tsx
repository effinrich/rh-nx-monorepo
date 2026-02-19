import { type BoxProps, Box } from '../box/box'
import { useColorModeValue } from '../color-mode/color-mode'

export const Card = (props: BoxProps) => (
  <Box
    minH="3xs"
    bg="bg-surface"
    boxShadow={useColorModeValue('sm', 'sm-dark')}
    borderRadius="lg"
    {...props}
  />
)
