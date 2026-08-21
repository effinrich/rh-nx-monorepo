import { Meta } from '@storybook/react-vite'

import { BasicUsageHooks } from './partials/basic-usage-hooks'
import { TransitionHooks } from './partials/transition-hooks'
import { AlertDialogRoot } from './alert-dialog'

export default {
  component: AlertDialogRoot,
  title: 'Components / Overlay / Alert Dialog',
  argTypes: {
    size: {
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'full'],
      control: { type: 'radio' }
    },
    placement: {
      options: ['center', 'top', 'bottom'],
      control: { type: 'radio' }
    },
    closeOnInteractOutside: {
      options: [true, false],
      control: { type: 'boolean' }
    }
  }
} as Meta<typeof AlertDialogRoot>

export const BasicUsage = {
  render: (args: Record<string, unknown>) => <BasicUsageHooks {...args} />
}

export const Transition = {
  render: (args: Record<string, unknown>) => <TransitionHooks {...args} />
}
