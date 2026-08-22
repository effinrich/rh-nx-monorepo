import * as React from 'react'

import { Stack } from '../../../index'

import {
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxRoot
} from '../checkbox'

export function ControlledCheckboxGroupCheckbox() {
  const [value, setValue] = React.useState<string[]>(['one', 'two'])
  return (
    <CheckboxGroup
      value={value}
      onValueChange={nextValue => {
        // eslint-disable-next-line no-console
        console.log(nextValue)
        setValue(nextValue)
      }}
    >
      <Stack direction="row" gap="40px">
        <CheckboxRoot value="one">
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>One</CheckboxLabel>
        </CheckboxRoot>
        <CheckboxRoot value="two">
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>Two</CheckboxLabel>
        </CheckboxRoot>
        <CheckboxRoot value="three">
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>Three</CheckboxLabel>
        </CheckboxRoot>
      </Stack>
    </CheckboxGroup>
  )
}
