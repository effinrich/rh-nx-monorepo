import {
  NumberInputControl,
  NumberInputDecrementTrigger,
  NumberInputIncrementTrigger,
  NumberInputInput,
  NumberInputRoot
} from '../number-input'

export function WithMinAndMaxNumberInput() {
  return (
    <NumberInputRoot defaultValue={15} min={10} max={20}>
      <NumberInputInput />
      <NumberInputControl>
        <NumberInputIncrementTrigger />
        <NumberInputDecrementTrigger />
      </NumberInputControl>
    </NumberInputRoot>
  )
}
