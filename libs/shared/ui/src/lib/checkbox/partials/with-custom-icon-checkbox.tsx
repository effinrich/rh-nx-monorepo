import * as React from 'react'

import { Heading, Separator, Stack } from '../../../index'

import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxRoot
} from '../checkbox'

import { CustomIcon } from './custom-icon'

export function WithCustomIconCheckbox() {
  const [checkedItems, setCheckedItems] = React.useState([false, false])

  const allChecked = checkedItems.every(Boolean)
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked

  return (
    <>
      <Heading>Default</Heading>
      <CheckboxRoot icon={<CustomIcon />} colorPalette="red">
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>Hello world</CheckboxLabel>
      </CheckboxRoot>

      <Separator />

      <Heading>Indeterminate</Heading>
      <CheckboxRoot
        checked={allChecked}
        indeterminate={isIndeterminate}
        onCheckedChange={e => {
          const next = e.checked === true
          setCheckedItems([next, next])
        }}
        icon={<CustomIcon />}
      >
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>Parent Checkbox</CheckboxLabel>
      </CheckboxRoot>
      <Stack ml="6" mt="2" align="start">
        <CheckboxRoot
          checked={checkedItems[0]}
          onCheckedChange={e =>
            setCheckedItems([e.checked === true, checkedItems[1]])
          }
        >
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>Child Checkbox 1</CheckboxLabel>
        </CheckboxRoot>
        <CheckboxRoot
          checked={checkedItems[1]}
          onCheckedChange={e =>
            setCheckedItems([checkedItems[0], e.checked === true])
          }
        >
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>Child Checkbox 2</CheckboxLabel>
        </CheckboxRoot>
      </Stack>
    </>
  )
}
