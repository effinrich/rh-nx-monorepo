import * as React from 'react'
import {
  Box,
  FieldHelperText,
  FieldLabel,
  FieldRoot,
  Stack
} from '@chakra-ui/react'

import { Input, InputGroup } from '../input'

import { FormError } from './form-error'

export function WithFieldInput() {
  const [isError, setIsError] = React.useState(false)
  return (
    <Stack align="start">
      <FieldRoot id="first-name" invalid={isError}>
        <Box display="flex" mb="2">
          <FieldLabel mb="0" lineHeight="1em">
            Amount
          </FieldLabel>
          <FormError>is invalid!</FormError>
        </Box>
        <InputGroup size="sm" startElement="$" endAddon=".com">
          <Input placeholder="Enter amount" />
        </InputGroup>
        <FieldHelperText>Keep it very short and sweet!</FieldHelperText>
      </FieldRoot>
      <button onClick={() => setIsError(s => !s)}>Toggle Invalid</button>
    </Stack>
  )
}
