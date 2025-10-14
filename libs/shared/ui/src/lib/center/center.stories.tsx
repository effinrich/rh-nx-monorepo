import { Meta, StoryFn } from '@storybook/react-vite'

import { Box } from '../box/box'
import { HStack } from '../h-stack/h-stack'
import { PhoneIcon } from '../icons/icons'

import { Center } from './center'

export default {
  component: Center,
  title: 'Components / Layout / Center'
} as Meta<typeof Center>

export const Default = {
  args: {
    bg: 'tomato',
    h: '100px',
    color: 'white',
    children: 'This is Center'
  }
}

export const WithIcons: StoryFn<typeof Center> = () => (
  <HStack>
    <Center w="40px" h="40px" bg="tomato" color="white">
      <PhoneIcon />
    </Center>
    <Center w="40px" h="40px" bg="tomato" color="white">
      <Box as="span" fontWeight="bold" fontSize="lg">
        1
      </Box>
    </Center>
  </HStack>
)
