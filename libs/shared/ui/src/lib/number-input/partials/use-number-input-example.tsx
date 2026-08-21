import { LoremIpsum } from 'react-lorem-ipsum'

import { Button, Input, rh } from '../../index'
import { useNumberInput } from '../number-input'

export function UseNumberInputExample(args: Record<string, unknown>) {
  const {
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
    valueAsNumber
  } = useNumberInput({
    step: 0.01,
    defaultValue: 1.53,
    min: 1,
    max: 6,
    precision: 2,
    allowMouseWheel: true
  })

  return (
    <>
      <div>current: {valueAsNumber}</div>
      <LoremIpsum p={1} />
      <rh.div display="flex" {...args}>
        <Button {...getIncrementButtonProps()}>+</Button>
        <Input {...getInputProps()} />
        <Button {...getDecrementButtonProps()}>-</Button>
      </rh.div>
      <LoremIpsum p={1} />
    </>
  )
}
