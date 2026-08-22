import { Stack } from '../../../index'

import { Radio, RadioGroupRoot } from '../radio'

export function DisabledRadioGroupRadio() {
  return (
    <RadioGroupRoot disabled>
      <Stack>
        <Radio value="one">One</Radio>
        <Radio value="two" disabled>
          Two
        </Radio>
        <Radio value="three" disabled={false}>
          Three
        </Radio>
      </Stack>
    </RadioGroupRoot>
  )
}
