import { Meta } from '@storybook/react-vite'

import { Center } from './center'
import { WithIconsCenter } from './partials/with-icons-center'

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

export const WithIcons = {
  render: () => <WithIconsCenter />
}
