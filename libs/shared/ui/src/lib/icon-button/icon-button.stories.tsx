import { MdPhone } from 'react-icons/md'

import { Meta } from '@storybook/react-vite'

import { Box, EmailIcon, PhoneIcon, SearchIcon } from '../../index'

import { IconButton } from './icon-button'

export default {
  component: IconButton,
  title: 'Components / Forms / IconButton',
  argTypes: {
    isActive: { type: 'boolean' },
    isDisabled: { type: 'boolean' },
    isPending: { type: 'boolean' },
    isRound: { type: 'boolean' },
    icon: { type: 'function' },
    'aria-label': { type: 'string' },
    variant: {
      options: ['solid', 'outline', 'ghost', 'link', 'unstyled'],
      control: { type: 'radio' }
    },
    size: {
      options: ['xs', 'sm', 'md', 'lg'],
      control: { type: 'radio' }
    },
    colorScheme: {
      options: [
        'primary',
        'blackAlpha',
        'gray',
        'red',
        'orange',
        'green',
        'facebook',
        'teal'
      ],
      control: { type: 'select' }
    }
  },
  args: {
    'aria-label': 'icon button action',
    icon: <SearchIcon />,
    colorScheme: 'primary',
    size: 'md',
    variant: 'solid'
  },
  decorators: [
    Story => (
      <Box display="flex" justifyContent="center">
        <Story />
      </Box>
    )
  ]
} as Meta<typeof IconButton>

export const Default = {
  args: {}
}

export const WithColors = {
  args: { colorScheme: 'blue' }
}

export const WithSizes = {
  args: {
    size: 'lg',
    icon: <PhoneIcon />,
    'aria-label': 'call this number'
  }
}

export const WithVariants = {
  args: {
    variant: 'outline',
    colorScheme: 'teal',
    icon: <EmailIcon />,
    'aria-label': 'send email'
  }
}

export const WithCustomIcon = {
  args: {
    variant: 'outline',
    colorScheme: 'teal',
    icon: <MdPhone />,
    fontSize: '20px',
    'aria-label': 'call this number'
  }
}
