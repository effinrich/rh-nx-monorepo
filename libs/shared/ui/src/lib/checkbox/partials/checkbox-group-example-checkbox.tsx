import { Stack } from '../../../index'

import {
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxRoot
} from '../checkbox'

export function CheckboxGroupExampleCheckbox() {
  return (
    <CheckboxGroup
      defaultValue={['one', 'two']}
      onValueChange={value => {
        // eslint-disable-next-line no-console
        console.log(value)
      }}
    >
      <Stack align="start" direction={['column', 'row']} gap={[2, 4, 6]}>
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
