import { Meta, StoryObj } from '@storybook/react-vite'

import {
  Box,
  HStack as ChakraHStack,
  Stack as ChakraStack,
  VStack as ChakraVStack
} from '../../index'

export default {
  component: ChakraStack,
  title: 'Components / Layout / Stack',
  args: {
    spacing: 8,
    isInline: false,
    direction: ['column', 'row']
  }
} as Meta<typeof ChakraStack>

export const Default: StoryObj<typeof ChakraStack> = {
  render: args => (
    <ChakraStack {...args}>
      <Box w="40px" h="40px" bg="yellow.200">
        1
      </Box>
      <Box w="40px" h="40px" bg="tomato">
        2
      </Box>
      <Box w="40px" h="40px" bg="pink.100">
        3
      </Box>
    </ChakraStack>
  )
}

export const VStack: StoryObj<typeof ChakraVStack> = {
  render: args => (
    <ChakraVStack {...args}>
      <Box w="40px" h="40px" bg="yellow.200">
        1
      </Box>
      <Box w="40px" h="40px" bg="tomato">
        2
      </Box>
      <Box w="40px" h="40px" bg="pink.100">
        3
      </Box>
    </ChakraVStack>
  )
}

export const HStack: StoryObj<typeof ChakraHStack> = {
  render: args => (
    <ChakraHStack {...args}>
      <Box w="40px" h="40px" bg="yellow.200">
        1
      </Box>
      <Box w="40px" h="40px" bg="tomato">
        2
      </Box>
      <Box w="40px" h="40px" bg="pink.100">
        3
      </Box>
    </ChakraHStack>
  )
}
