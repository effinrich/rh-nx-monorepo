import { Kbd as ChakraKbd } from '@chakra-ui/react'

import { Flex, Spacer as RhSpacer } from '../flex/flex'

import { Box } from './box'

export default {
  title: 'Components / Layout / Box',
  component: Box
}

export const Basic = () => (
  <Box>
    <Box color="tomato" _hover={{ bg: 'red.500', color: 'white' }}>
      Just a box
    </Box>
    <Box
      position="relative"
      bg="red.400"
      _before={{
        height: 0,
        content: `""`,
        display: 'block',
        paddingBottom: ['40px', '100px']
      }}
    />
  </Box>
)

export const Kbd = () => <ChakraKbd>Ctrl + L</ChakraKbd>

export const Spacer = () => (
  <Flex
    color={['green.400', 'tomato']}
    direction={{ base: 'column', md: 'row' }}
  >
    <Box bg="pink.500" boxSize="100px">
      Box 1
    </Box>
    <RhSpacer />
    <Box bg="green.500" boxSize="100px">
      Box 2
    </Box>
  </Flex>
)
