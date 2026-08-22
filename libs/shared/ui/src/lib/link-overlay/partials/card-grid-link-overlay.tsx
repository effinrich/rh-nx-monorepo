import { Box } from '../../box/box'
import { Heading } from '../../heading/heading'
import { Text } from '../../text/text'

import { LinkBox, LinkOverlay } from '../link-overlay'

export function CardGridLinkOverlay() {
  return (
    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="4" maxW="2xl">
      <LinkBox
        as="article"
        p="5"
        borderWidth="1px"
        rounded="md"
        _hover={{ shadow: 'md' }}
      >
        <Heading size="sm" my="2">
          <LinkOverlay href="#">Getting Started</LinkOverlay>
        </Heading>
        <Text fontSize="sm">Quick introduction to our platform</Text>
      </LinkBox>
      <LinkBox
        as="article"
        p="5"
        borderWidth="1px"
        rounded="md"
        _hover={{ shadow: 'md' }}
      >
        <Heading size="sm" my="2">
          <LinkOverlay href="#">Best Practices</LinkOverlay>
        </Heading>
        <Text fontSize="sm">Learn from our experience</Text>
      </LinkBox>
      <LinkBox
        as="article"
        p="5"
        borderWidth="1px"
        rounded="md"
        _hover={{ shadow: 'md' }}
      >
        <Heading size="sm" my="2">
          <LinkOverlay href="#">API Documentation</LinkOverlay>
        </Heading>
        <Text fontSize="sm">Complete API reference</Text>
      </LinkBox>
      <LinkBox
        as="article"
        p="5"
        borderWidth="1px"
        rounded="md"
        _hover={{ shadow: 'md' }}
      >
        <Heading size="sm" my="2">
          <LinkOverlay href="#">Support</LinkOverlay>
        </Heading>
        <Text fontSize="sm">Get help when you need it</Text>
      </LinkBox>
    </Box>
  )
}
