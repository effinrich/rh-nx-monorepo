import { Radio, RadioGroupRoot } from '../radio'

export function DisabledRadio() {
  return (
    <RadioGroupRoot>
      <Radio value="disabled" disabled>
        Disabled
      </Radio>
    </RadioGroupRoot>
  )
}
