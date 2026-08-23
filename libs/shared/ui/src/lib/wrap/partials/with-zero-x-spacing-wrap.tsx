import { Box } from '../../box/box'
import { Text } from '../../text/text'
import { Wrap } from '../wrap'

import { Placeholder } from './placeholder'

export function WithZeroXSpacingWrap() {
  return (
    <Box>
      <Text>Welcome</Text>
      <Box bg="pink">
        <Wrap maxW="200px" columnGap={20} rowGap={4}>
          <Placeholder />
          <Placeholder />
          <Placeholder />
          <Placeholder />
          <Placeholder />
          <Placeholder />
          <Placeholder />
          <Placeholder />
          <Placeholder />
          <Placeholder />
          <Placeholder />
        </Wrap>
      </Box>
      <Text>Welcome</Text>
    </Box>
  )
}
