import { Meta, StoryFn } from '@storybook/react-vite'

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

const Template: StoryFn<typeof ColorModeToggle> = () => <ColorModeToggle />

export const Default = {
  render: Template,
  args: {}
}
