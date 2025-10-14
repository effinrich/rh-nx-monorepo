import type { Meta, StoryObj } from '@storybook/react-vite'

import AutoComplete from './auto-complete'
import filters from './filters'

const meta: Meta<typeof AutoComplete> = {
  component: AutoComplete,
  title: 'Components / Forms / AutoComplete',
  argTypes: {
    options: {
      table: {
        disable: true
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof AutoComplete>

export const Default: Story = {
  decorators: [],

  args: {
    isAsync: true,
    options: filters,
    isMulti: true
  }
}
