import {
  NumberInputControl,
  NumberInputDecrementTrigger,
  NumberInputIncrementTrigger,
  NumberInputInput,
  NumberInputRoot
} from '../number-input'

export function AllowOutOfRangeNumberInput() {
  return (
    <NumberInputRoot
      defaultValue={15}
      max={10}
      keepWithinRange={false}
      clampValueOnBlur={false}
    >
      <NumberInputInput />
      <NumberInputControl>
        <NumberInputIncrementTrigger />
        <NumberInputDecrementTrigger />
      </NumberInputControl>
    </NumberInputRoot>
  )
}
