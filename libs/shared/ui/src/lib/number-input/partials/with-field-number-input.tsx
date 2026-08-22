import * as React from 'react'

import {
  Button,
  FieldHelperText,
  FieldLabel,
  FieldRoot,
  rh,
  Stack
} from '../../../index'

import {
  NumberInputControl,
  NumberInputDecrementTrigger,
  NumberInputIncrementTrigger,
  NumberInputInput,
  NumberInputRoot
} from '../number-input'

import { FormError } from './form-error'

export function WithFieldNumberInput() {
  const [isError, setIsError] = React.useState(false)

  return (
    <Stack align="start">
      <FieldRoot id="first-name" invalid={isError}>
        <rh.div display="flex" mb="2">
          <FieldLabel mb="0" lineHeight="1em">
            Amount
          </FieldLabel>
          <FormError>is invalid!</FormError>
        </rh.div>
        <NumberInputRoot
          max={50}
          min={10}
          defaultValue={20}
          onBlur={() => {
            // eslint-disable-next-line no-console
            console.log('blurred')
          }}
        >
          <NumberInputInput />
          <NumberInputControl>
            <NumberInputIncrementTrigger />
            <NumberInputDecrementTrigger />
          </NumberInputControl>
        </NumberInputRoot>
        <FieldHelperText>Keep it very short and sweet!</FieldHelperText>
      </FieldRoot>
      <Button onClick={() => setIsError(s => !s)}>Toggle Invalid</Button>
    </Stack>
  )
}
