import { useState } from 'react'

import { expect } from '@storybook/jest'
import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { within } from '@storybook/testing-library'

import { Flex } from '../flex/flex'

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
  render: function Component(args) {
    const [, updateArgs] = useArgs()

    const onChange = (date: Date | null) => {
      if (date) {
        onChange(date)
        updateArgs({ selected: date })
      }
    }

    return <DatePicker {...args} onChange={onChange} />
  }
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

const Range = () => {
  const [startDate, setStartDate] = useState(new Date('2014/02/08'))
  const [endDate, setEndDate] = useState(new Date('2014/02/10'))
  return (
    <Flex w="500px">
      <DatePicker
        selected={startDate}
        onChange={date => date && setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
      />
      <DatePicker
        selected={endDate}
        onChange={date => date && setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
      />
    </Flex>
  )
}

export const WithRange: Story = {
  render: (args: any) => <Range {...args} />
}
