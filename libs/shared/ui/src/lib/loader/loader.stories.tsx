import { Meta } from '@storybook/react-vite'

import { Loader } from './loader'

export default {
  component: Loader,
  title: 'Patterns / Feedback / Loader',
  args: {
    size: 'md',
    color: 'primary.500',
    thickness: '4px',
    speed: '0.65s',
    minH: '25vh'
  },
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg', 'xl'],
      control: { type: 'radio' }
    },
    color: {
      options: [
        'primary.500',
        'primary.300',
        'blackAlpha.800',
        'gray.600',
        'red.500',
        'orange.700',
        'green.300',
        'facebook.500',
        'teal.500'
      ],
      control: { type: 'select' }
    },
    thickness: {
      options: ['6px', '5px', '4px', '3px', '2px', '1px'],
      control: { type: 'select' }
    }
  },
  parameters: {
    controls: { include: ['size', 'color', 'thickness', 'speed', 'minH'] }
  }
} as Meta<typeof Loader>

export const Default = {
  args: {}
}
