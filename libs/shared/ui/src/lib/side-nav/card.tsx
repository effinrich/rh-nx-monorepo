import { useColorModeValue } from '../color-mode/color-mode'

import { type BoxProps, Box } from '../box/box'

export const Card = (props: BoxProps) => (
  <Box
    minH="3xs"
    bg="bg-surface"
    boxShadow={useColorModeValue('sm', 'sm-dark')}
    borderRadius="lg"
    {...props}
  />
)
