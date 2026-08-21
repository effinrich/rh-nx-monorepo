import { useArgs } from 'storybook/preview-api'

import { type DatePickerProps, DatePicker } from '../date-picker'

export function ControlledDatePicker(args: DatePickerProps) {
  const [, updateArgs] = useArgs()

  const onChange = (date: Date | null) => {
    if (date) {
      updateArgs({ selected: date })
    }
  }

  return <DatePicker {...args} onChange={onChange} />
}
