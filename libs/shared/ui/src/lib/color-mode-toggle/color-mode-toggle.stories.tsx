import { Meta } from '@storybook/react-vite'

import { Box } from '../../index'

import { ColorModeToggle } from './color-mode-toggle'

export default {
  component: ColorModeToggle,
  title: 'Patterns / System/ Color Mode Toggle',
  decorators: [
    Story => (
      <Box display="flex" justifyContent="center">
        {Story()}
      </Box>
    )
  ]
} as Meta<typeof ColorModeToggle>

export const Default = {
  render: () => <ColorModeToggle />,
  args: {}
}
