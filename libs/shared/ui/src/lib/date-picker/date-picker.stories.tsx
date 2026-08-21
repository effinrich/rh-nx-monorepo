import { useArgs } from 'storybook/preview-api'
import { expect, within } from 'storybook/test'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { ControlledDatePicker } from './partials/controlled-date-picker'
import { RangeDatePicker } from './partials/range-date-picker'
import { DatePicker } from './date-picker'

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
  title: 'components / Forms / Date Picker',
  args: {
    selected: new Date(),
    onChange: (value: Date | null) => value,
    selectsStart: false,
    selectsEnd: false,
    startDate: undefined,
    endDate: undefined
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/pDrgZWbUTfF49d6uoTK2Vi/%5BPlatform%5D-Vendor-Info-Collection-%26-Search?type=design&node-id=212-26558&mode=design&t=RoNdlLKpMQYbMdjv-4'
    }
  },
  render: args => <ControlledDatePicker {...args} />
}

export default meta
type Story = StoryObj<typeof DatePicker>

export const Default: Story = {
  args: { selected: new Date('Tue Jan 02 2024 00:00:00 GMT-0500') },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(/Welcome to DatePicker!/gi)).toBeTruthy()
  }
}

export const WithRange: Story = {
  render: () => <RangeDatePicker />
}
