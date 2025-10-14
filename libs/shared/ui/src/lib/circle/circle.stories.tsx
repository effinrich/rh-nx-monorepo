import { Meta, StoryFn } from '@storybook/react-vite'

import { HStack } from '../h-stack/h-stack'
import { PhoneIcon } from '../icons/icons'
import { Square } from '../square/square'

import { Circle } from './circle'

export default {
  component: Circle,
  title: 'Components / Layout / Circle & Square'
} as Meta<typeof Circle>

export const WithCircle = {
  args: {
    bg: 'tomato',
    size: '40px',
    color: 'white',
    children: <PhoneIcon />
  }
}

export const WithSquare: StoryFn<typeof Square> = () => (
  <Square size="40px" bg="purple.700" color="white">
    <PhoneIcon />
  </Square>
)

export const SquareAndCircle: StoryFn<typeof Circle | typeof Square> = () => (
  <HStack>
    <Circle size="40px" bg="tomato" color="white">
      <PhoneIcon />
    </Circle>
    <Square size="40px" bg="purple.700" color="white">
      <PhoneIcon />
    </Square>
  </HStack>
)
