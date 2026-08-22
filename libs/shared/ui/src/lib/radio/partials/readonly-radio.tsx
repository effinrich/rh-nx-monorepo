import { Radio, RadioGroupRoot } from '../radio'

export function ReadonlyRadio() {
  return (
    <RadioGroupRoot defaultValue="readonly">
      <Radio value="readonly" readOnly size="lg" colorPalette="green">
        I'm a readonly radio
      </Radio>
    </RadioGroupRoot>
  )
}
