import { useState } from 'react'

import {
  Box,
  FieldHelperText,
  FieldLabel,
  FieldRoot,
  Stack
} from '../../../index'

import { Textarea } from '../textarea'

import { FormError } from './form-error'

export function WithFieldTextarea() {
  const [isError, setIsError] = useState(false)
  return (
    <Stack align="start">
      <FieldRoot id="first-name" invalid={isError}>
        <Box display="flex" mb="2">
          <FieldLabel mb="0" lineHeight="1em">
            Amount
          </FieldLabel>
          <FormError>is invalid!</FormError>
        </Box>
        <Textarea placeholder="Enter amount" />
        <FieldHelperText>Keep it very short and sweet!</FieldHelperText>
      </FieldRoot>
      <button onClick={() => setIsError(s => !s)}>Toggle Invalid</button>
    </Stack>
  )
}
