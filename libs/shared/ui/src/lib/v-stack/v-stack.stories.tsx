import { Meta, StoryFn } from '@storybook/react-vite'

import { Avatar } from '../avatar/avatar'
import { Badge } from '../badge/badge'
import { Box } from '../box/box'
import { Button } from '../button/button'
import { Divider } from '../divider/divider'
import { Heading } from '../heading/heading'
import { HStack } from '../h-stack/h-stack'
import { Text } from '../text/text'

import { VStack } from './v-stack'

export default {
  component: VStack,
  title: 'Components / Layout / VStack'
} as Meta<typeof VStack>

export const Basic = {
  args: {
    spacing: '4',
    children: [
      <Box key="1" p="4" bg="primary.100" borderRadius="md">
        Item 1
      </Box>,
      <Box key="2" p="4" bg="primary.100" borderRadius="md">
        Item 2
      </Box>,
      <Box key="3" p="4" bg="primary.100" borderRadius="md">
        Item 3
      </Box>
    ]
  }
}

export const WithDifferentSpacing: StoryFn<typeof VStack> = () => (
  <HStack spacing="8" align="start">
    <VStack spacing="1">
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
    <VStack spacing="4">
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
    <VStack spacing="8">
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

export const WithDivider: StoryFn<typeof VStack> = () => (
  <VStack
    divider={<Divider />}
    spacing="4"
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

export const Alignment: StoryFn<typeof VStack> = () => (
  <HStack spacing="8" align="start">
    <VStack align="start" spacing="3" w="200px">
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
    <VStack align="center" spacing="3" w="200px">
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
    <VStack align="end" spacing="3" w="200px">
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

export const UserProfile: StoryFn<typeof VStack> = () => (
  <VStack
    spacing="4"
    align="start"
    p="6"
    borderWidth="1px"
    borderRadius="lg"
    maxW="sm"
  >
    <HStack spacing="4">
      <Avatar size="lg" name="Jane Doe" src="https://bit.ly/dan-abramov" />
      <VStack align="start" spacing="1">
        <Heading size="md">Jane Doe</Heading>
        <Text fontSize="sm" color="gray.500">
          Product Designer
        </Text>
        <Badge colorScheme="green">Active</Badge>
      </VStack>
    </HStack>
    <Divider />
    <VStack align="start" spacing="2" w="full">
      <Text fontSize="sm" fontWeight="semibold">
        About
      </Text>
      <Text fontSize="sm" color="gray.600">
        Passionate about creating beautiful and functional user experiences.
        Based in San Francisco.
      </Text>
    </VStack>
    <Divider />
    <HStack spacing="3" w="full">
      <Button flex="1" colorScheme="primary" size="sm">
        Follow
      </Button>
      <Button flex="1" variant="outline" size="sm">
        Message
      </Button>
    </HStack>
  </VStack>
)

export const NotificationList: StoryFn<typeof VStack> = () => (
  <VStack
    spacing="0"
    align="stretch"
    maxW="md"
    borderWidth="1px"
    borderRadius="md"
    overflow="hidden"
  >
    <Box p="4" _hover={{ bg: 'gray.50' }} cursor="pointer">
      <HStack spacing="3">
        <Avatar size="sm" name="John Smith" />
        <VStack align="start" spacing="1" flex="1">
          <Text fontSize="sm" fontWeight="semibold">
            John Smith commented on your post
          </Text>
          <Text fontSize="xs" color="gray.500">
            2 hours ago
          </Text>
        </VStack>
      </HStack>
    </Box>
    <Divider />
    <Box p="4" _hover={{ bg: 'gray.50' }} cursor="pointer">
      <HStack spacing="3">
        <Avatar size="sm" name="Sarah Johnson" />
        <VStack align="start" spacing="1" flex="1">
          <Text fontSize="sm" fontWeight="semibold">
            Sarah Johnson started following you
          </Text>
          <Text fontSize="xs" color="gray.500">
            5 hours ago
          </Text>
        </VStack>
      </HStack>
    </Box>
    <Divider />
    <Box p="4" _hover={{ bg: 'gray.50' }} cursor="pointer">
      <HStack spacing="3">
        <Avatar size="sm" name="Mike Wilson" />
        <VStack align="start" spacing="1" flex="1">
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
