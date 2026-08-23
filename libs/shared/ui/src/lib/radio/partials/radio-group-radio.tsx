import * as React from 'react'

import { Stack } from '../../../index'
import { Radio, RadioGroupRoot } from '../radio'

export function RadioGroupRadio() {
  const [value, setValue] = React.useState('')
  return (
    <RadioGroupRoot
      value={value}
      onValueChange={({ value }) => setValue(value ?? '')}
    >
      <Stack>
        <Radio value="Option 1">Option 1</Radio>
        <Radio value="Option 2">Option 2</Radio>
        <Radio value="Option 3">Option 3</Radio>
      </Stack>
      <button onClick={() => setValue('')}>Clear</button>
    </RadioGroupRoot>
  )
}
