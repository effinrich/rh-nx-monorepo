import { AvatarFallback, AvatarRoot } from '../../avatar/avatar'
import { Box } from '../../box/box'
import { Separator } from '../../divider/divider'
import { HStack } from '../../h-stack/h-stack'
import { Text } from '../../text/text'
import { VStack } from '../v-stack'

export function NotificationListVStack() {
  return (
    <VStack
      gap="0"
      align="stretch"
      maxW="md"
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
    >
      <Box p="4" _hover={{ bg: 'gray.50' }} cursor="pointer">
        <HStack gap="3">
          <AvatarRoot size="sm">
            <AvatarFallback name="John Smith" />
          </AvatarRoot>
          <VStack align="start" gap="1" flex="1">
            <Text fontSize="sm" fontWeight="semibold">
              John Smith commented on your post
            </Text>
            <Text fontSize="xs" color="gray.500">
              2 hours ago
            </Text>
          </VStack>
        </HStack>
      </Box>
      <Separator />
      <Box p="4" _hover={{ bg: 'gray.50' }} cursor="pointer">
        <HStack gap="3">
          <AvatarRoot size="sm">
            <AvatarFallback name="Sarah Johnson" />
          </AvatarRoot>
          <VStack align="start" gap="1" flex="1">
            <Text fontSize="sm" fontWeight="semibold">
              Sarah Johnson started following you
            </Text>
            <Text fontSize="xs" color="gray.500">
              5 hours ago
            </Text>
          </VStack>
        </HStack>
      </Box>
      <Separator />
      <Box p="4" _hover={{ bg: 'gray.50' }} cursor="pointer">
        <HStack gap="3">
          <AvatarRoot size="sm">
            <AvatarFallback name="Mike Wilson" />
          </AvatarRoot>
          <VStack align="start" gap="1" flex="1">
            <Text fontSize="sm" fontWeight="semibold">
              Mike Wilson liked your article
            </Text>
            <Text fontSize="xs" color="gray.500">
              1 day ago
            </Text>
          </VStack>
        </HStack>
      </Box>
    </VStack>
  )
}
