import { Box } from '../../box/box'
import { HStack } from '../../h-stack/h-stack'
import { Text } from '../../text/text'

import { VStack } from '../v-stack'

export function WithDifferentSpacingVStack() {
  return (
    <HStack gap="8" align="start">
      <VStack gap="1">
        <Text fontSize="sm" fontWeight="bold" color="gray.600">
          spacing = 1
        </Text>
        <Box p="3" bg="blue.100" borderRadius="md" w="120px">
          Item 1
        </Box>
        <Box p="3" bg="blue.100" borderRadius="md" w="120px">
          Item 2
        </Box>
        <Box p="3" bg="blue.100" borderRadius="md" w="120px">
          Item 3
        </Box>
      </VStack>
      <VStack gap="4">
        <Text fontSize="sm" fontWeight="bold" color="gray.600">
          spacing = 4
        </Text>
        <Box p="3" bg="blue.100" borderRadius="md" w="120px">
          Item 1
        </Box>
        <Box p="3" bg="blue.100" borderRadius="md" w="120px">
          Item 2
        </Box>
        <Box p="3" bg="blue.100" borderRadius="md" w="120px">
          Item 3
        </Box>
      </VStack>
      <VStack gap="8">
        <Text fontSize="sm" fontWeight="bold" color="gray.600">
          spacing = 8
        </Text>
        <Box p="3" bg="blue.100" borderRadius="md" w="120px">
          Item 1
        </Box>
        <Box p="3" bg="blue.100" borderRadius="md" w="120px">
          Item 2
        </Box>
        <Box p="3" bg="blue.100" borderRadius="md" w="120px">
          Item 3
        </Box>
      </VStack>
    </HStack>
  )
}
