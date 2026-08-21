import { Box, BoxProps } from '@chakra-ui/react'

export const ShadowBox = (props: BoxProps) => (
  <Box
    bg="bg-surface"
    boxShadow={{ _light: 'sm', _dark: 'sm-dark' }}
    borderRadius="lg"
    borderWidth={1}
    borderColor="gray.200"
    {...props}
  />
)

export default ShadowBox
