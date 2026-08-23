import { AvatarFallback, AvatarImage, AvatarRoot } from '../../avatar/avatar'
import { Box } from '../../box/box'
import { HStack } from '../../h-stack/h-stack'
import { Heading } from '../../heading/heading'
import { Text } from '../../text/text'
import { LinkBox, LinkOverlay } from '../link-overlay'

export function WithAvatarLinkOverlay() {
  return (
    <LinkBox as="article" p="5" borderWidth="1px" rounded="md">
      <HStack gap="3" mb="3">
        <AvatarRoot>
          {/* @ts-expect-error Chakra v3 compound component typing */}
          <AvatarImage src="https://bit.ly/dan-abramov" />
          <AvatarFallback name="John Doe" />
        </AvatarRoot>
        <Box>
          <Text fontWeight="semibold">John Doe</Text>
          <Text fontSize="sm" color="gray.500">
            2 hours ago
          </Text>
        </Box>
      </HStack>
      <Heading size="md" my="2">
        <LinkOverlay href="#">Understanding Design Systems</LinkOverlay>
      </Heading>
      <Text>
        A comprehensive guide to building and maintaining design systems at
        scale.
      </Text>
    </LinkBox>
  )
}
