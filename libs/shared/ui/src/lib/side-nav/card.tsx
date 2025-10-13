import { useColorModeValue } from '@chakra-ui/react'

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
