import { Meta, StoryFn } from '@storybook/react-vite'

import { Avatar } from '../avatar/avatar'
import { Box } from '../box/box'
import { Heading } from '../heading/heading'
import { HStack } from '../h-stack/h-stack'
import { Text } from '../text/text'

import { LinkBox, LinkOverlay } from './link-overlay'

export default {
  component: LinkBox,
  title: 'Components / Navigation / LinkOverlay'
} as Meta<typeof LinkBox>

export const Basic: StoryFn<typeof LinkBox> = () => (
  <LinkBox as="article" maxW="sm" p="5" borderWidth="1px" rounded="md">
    <Heading size="md" my="2">
      <LinkOverlay href="#">New Product Launch</LinkOverlay>
    </Heading>
    <Text>
      Learn about our exciting new product features and improvements.
    </Text>
  </LinkBox>
)

export const WithImage: StoryFn<typeof LinkBox> = () => (
  <LinkBox
    as="article"
    maxW="sm"
    p="5"
    borderWidth="1px"
    rounded="md"
    _hover={{ shadow: 'md' }}
  >
    <Box mb="3">
      <img
        src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop"
        alt="Product"
        style={{ borderRadius: '0.375rem' }}
      />
    </Box>
    <Heading size="md" my="2">
      <LinkOverlay href="#">Living Room Collection</LinkOverlay>
    </Heading>
    <Text mb="3">Explore our newest furniture designs for modern homes.</Text>
    <Text fontSize="sm" color="gray.500">
      Published: March 15, 2024
    </Text>
  </LinkBox>
)

export const WithAvatar: StoryFn<typeof LinkBox> = () => (
  <LinkBox as="article" p="5" borderWidth="1px" rounded="md">
    <HStack spacing="3" mb="3">
      <Avatar name="John Doe" src="https://bit.ly/dan-abramov" />
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
      A comprehensive guide to building and maintaining design systems at scale.
    </Text>
  </LinkBox>
)

export const CardGrid: StoryFn<typeof LinkBox> = () => (
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
