import { Meta } from '@storybook/react-vite'

import { PhoneIcon } from '../icons/icons'

import { Circle } from './circle'
import { SquareAndCircleExample } from './partials/square-and-circle'
import { WithSquareCircle } from './partials/with-square-circle'

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

export const WithSquare = {
  render: () => <WithSquareCircle />
}

export const SquareAndCircle = {
  render: () => <SquareAndCircleExample />
}
