import { Box } from '../../box/box'
import { Separator } from '../../divider/divider'
import { Heading } from '../../heading/heading'
import { Text } from '../../text/text'

import { VStack } from '../v-stack'

export function WithDividerVStack() {
  return (
    <VStack
      separator={<Separator />}
      gap="4"
      align="stretch"
      maxW="md"
      p="4"
      borderWidth="1px"
      borderRadius="md"
    >
      <Box>
        <Heading size="sm">Section 1</Heading>
        <Text fontSize="sm" color="gray.600">
          This is the first section
        </Text>
      </Box>
      <Box>
        <Heading size="sm">Section 2</Heading>
        <Text fontSize="sm" color="gray.600">
          This is the second section
        </Text>
      </Box>
      <Box>
        <Heading size="sm">Section 3</Heading>
        <Text fontSize="sm" color="gray.600">
          This is the third section
        </Text>
      </Box>
    </VStack>
  )
}
