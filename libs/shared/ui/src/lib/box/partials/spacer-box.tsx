import { Flex, Spacer as RhSpacer } from '../../flex/flex'

import { Box } from '../box'

export function SpacerBox() {
  return (
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
}
