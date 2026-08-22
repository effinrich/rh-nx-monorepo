import { Stack } from '../../../index'

import { CheckboxControl, CheckboxHiddenInput, CheckboxRoot } from '../checkbox'

export function SizesCheckbox() {
  const sizes = ['sm', 'md', 'lg']

  return (
    <Stack direction="row">
      {sizes.map(size => (
        <CheckboxRoot key={size} size={size}>
          <CheckboxHiddenInput />
          <CheckboxControl />
        </CheckboxRoot>
      ))}
    </Stack>
  )
}
