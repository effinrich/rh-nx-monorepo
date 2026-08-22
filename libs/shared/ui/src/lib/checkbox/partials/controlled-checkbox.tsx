import * as React from 'react'

import { CheckboxControl, CheckboxHiddenInput, CheckboxRoot } from '../checkbox'

export function ControlledCheckbox() {
  const [value, setValue] = React.useState(false)

  return (
    <CheckboxRoot
      checked={value}
      onCheckedChange={e => setValue(e.checked === true)}
    >
      <CheckboxHiddenInput />
      <CheckboxControl />
    </CheckboxRoot>
  )
}
