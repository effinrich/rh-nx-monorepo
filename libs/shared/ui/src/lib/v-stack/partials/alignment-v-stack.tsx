import { Box } from '../../box/box'
import { HStack } from '../../h-stack/h-stack'
import { Text } from '../../text/text'

import { VStack } from '../v-stack'

export function AlignmentVStack() {
  return (
    <HStack gap="8" align="start">
      <VStack align="start" gap="3" w="200px">
        <Text fontSize="sm" fontWeight="bold" color="gray.600">
          align = start
        </Text>
        <Box p="3" bg="purple.100" borderRadius="md">
          Short
        </Box>
        <Box p="3" bg="purple.100" borderRadius="md">
          Medium content
        </Box>
        <Box p="3" bg="purple.100" borderRadius="md">
          Much longer content here
        </Box>
      </VStack>
      <VStack align="center" gap="3" w="200px">
        <Text fontSize="sm" fontWeight="bold" color="gray.600">
          align = center
        </Text>
        <Box p="3" bg="purple.100" borderRadius="md">
          Short
        </Box>
        <Box p="3" bg="purple.100" borderRadius="md">
          Medium content
        </Box>
        <Box p="3" bg="purple.100" borderRadius="md">
          Much longer content here
        </Box>
      </VStack>
      <VStack align="end" gap="3" w="200px">
        <Text fontSize="sm" fontWeight="bold" color="gray.600">
          align = end
        </Text>
        <Box p="3" bg="purple.100" borderRadius="md">
          Short
        </Box>
        <Box p="3" bg="purple.100" borderRadius="md">
          Medium content
        </Box>
        <Box p="3" bg="purple.100" borderRadius="md">
          Much longer content here
        </Box>
      </VStack>
    </HStack>
  )
}
