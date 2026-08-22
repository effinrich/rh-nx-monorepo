import { rh, Stack } from '../../../index'

import {
  NumberInputControl,
  NumberInputDecrementTrigger,
  NumberInputIncrementTrigger,
  NumberInputInput,
  NumberInputRoot
} from '../number-input'

const sizes = ['xs', 'sm', 'md', 'lg'] as const

export function SizesNumberInput() {
  return (
    <Stack gap="6">
      {sizes.map(size => (
        <rh.div key={size}>
          <pre>size = {size}</pre>
          <NumberInputRoot mt="2" size={size} defaultValue={15} min={10}>
            <NumberInputInput />
            <NumberInputControl>
              <NumberInputIncrementTrigger />
              <NumberInputDecrementTrigger />
            </NumberInputControl>
          </NumberInputRoot>
        </rh.div>
      ))}
    </Stack>
  )
}
