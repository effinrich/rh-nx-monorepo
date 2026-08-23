import { AvatarFallback, AvatarImage, AvatarRoot } from '../../avatar/avatar'
import { Badge } from '../../badge/badge'
import { Button } from '../../button/button'
import { Separator } from '../../divider/divider'
import { HStack } from '../../h-stack/h-stack'
import { Heading } from '../../heading/heading'
import { Text } from '../../text/text'
import { VStack } from '../v-stack'

export function UserProfileVStack() {
  return (
    <VStack
      gap="4"
      align="start"
      p="6"
      borderWidth="1px"
      borderRadius="lg"
      maxW="sm"
    >
      <HStack gap="4">
        <AvatarRoot size="lg">
          {/* @ts-expect-error Chakra v3 compound component typing */}
          <AvatarImage src="https://bit.ly/dan-abramov" />
          <AvatarFallback name="Jane Doe" />
        </AvatarRoot>
        <VStack align="start" gap="1">
          <Heading size="md">Jane Doe</Heading>
          <Text fontSize="sm" color="gray.500">
            Product Designer
          </Text>
          <Badge colorPalette="green">Active</Badge>
        </VStack>
      </HStack>
      <Separator />
      <VStack align="start" gap="2" w="full">
        <Text fontSize="sm" fontWeight="semibold">
          About
        </Text>
        <Text fontSize="sm" color="gray.600">
          Passionate about creating beautiful and functional user experiences.
          Based in San Francisco.
        </Text>
      </VStack>
      <Separator />
      <HStack gap="3" w="full">
        <Button flex="1" colorPalette="primary" size="sm">
          Follow
        </Button>
        <Button flex="1" variant="outline" size="sm">
          Message
        </Button>
      </HStack>
    </VStack>
  )
}
