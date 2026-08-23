import { Stack } from '../../../index'
import { Radio, RadioGroupRoot } from '../radio'

export function GroupWithStackRadio() {
  return (
    <RadioGroupRoot
      defaultValue="Option 1"
      onValueChange={({ value }) => console.log(value)}
    >
      <Stack>
        <Radio value="Option 1">Option 1</Radio>
        <Radio value="Option 2">Option 2</Radio>
        <Radio value="Option 3">Option 3</Radio>
      </Stack>
    </RadioGroupRoot>
  )
}
