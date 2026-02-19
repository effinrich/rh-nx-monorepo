import { Box, BoxProps } from '@chakra-ui/react'
import { useColorModeValue } from '../color-mode/color-mode'

export const ShadowBox = (props: BoxProps) => (
  <Box
    // minH="3xs"
    bg="bg-surface"
    boxShadow={useColorModeValue('sm', 'sm-dark')}
    borderRadius="lg"
    borderWidth={1}
    borderColor="gray.200"
    {...props}
  />
)

export default ShadowBox
