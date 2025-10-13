import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react'

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
