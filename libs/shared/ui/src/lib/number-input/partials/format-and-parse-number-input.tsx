import * as React from 'react'

import { Button, Input, rh } from '../../../index'

import { useNumberInput } from '../number-input'

const format = (val: string) => `$${val}`
const parse = (val: string) => val.replace(/^\$/, '')

export function FormatAndParseNumberInput() {
  const [value, setValue] = React.useState<string>('1.53')

  const {
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
    valueAsNumber
  } = useNumberInput({
    step: 0.01,
    value: format(value),
    min: 1,
    max: 6,
    precision: 2,
    onValueChange: ({ value: next }) => setValue(parse(next))
  })

  return (
    <>
      <div>current: {valueAsNumber}</div>
      <rh.div display="flex">
        <Button {...getIncrementButtonProps()}>+</Button>
        <Input {...getInputProps()} />
        <Button {...getDecrementButtonProps()}>-</Button>
      </rh.div>
    </>
  )
}
