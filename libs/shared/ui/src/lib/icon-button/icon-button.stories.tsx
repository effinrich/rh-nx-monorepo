import { MdPhone } from 'react-icons/md'

import { Meta } from '@storybook/react-vite'

import { Box, EmailIcon, PhoneIcon, SearchIcon } from '../../index'

import { IconButton } from './icon-button'

export default {
  component: IconButton,
  title: 'Components / Forms / IconButton',
  argTypes: {
    'aria-label': { type: 'string' },
    variant: {
      options: ['solid', 'outline', 'ghost', 'link', 'unstyled'],
      control: { type: 'radio' }
    },
    size: {
      options: ['xs', 'sm', 'md', 'lg'],
      control: { type: 'radio' }
    },
    colorPalette: {
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
  decorators: [
    (Story: any) => (
      <Box display="flex" justifyContent="center">
        <Story />
      </Box>
    )
  ]
} as Meta<typeof IconButton>

export const Default = {
  render: () => (
    <IconButton aria-label="search" colorPalette="primary" size="md" variant="solid">
      <SearchIcon />
    </IconButton>
  )
}

export const WithColors = {
  render: () => (
    <IconButton aria-label="search" colorPalette="blue">
      <SearchIcon />
    </IconButton>
  )
}

export const WithSizes = {
  render: () => (
    <IconButton size="lg" aria-label="call this number">
      <PhoneIcon />
    </IconButton>
  )
}

export const WithVariants = {
  render: () => (
    <IconButton variant="outline" colorPalette="teal" aria-label="send email">
      <EmailIcon />
    </IconButton>
  )
}

export const WithCustomIcon = {
  render: () => (
    <IconButton variant="outline" colorPalette="teal" fontSize="20px" aria-label="call this number">
      <MdPhone />
    </IconButton>
  )
}
