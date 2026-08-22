import { useState } from 'react'

import { NativeSelectField, NativeSelectRoot } from '../select'

export function SelectControlledSelect() {
  const [value, setValue] = useState('')
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value)
  }

  return (
    <NativeSelectRoot>
      <NativeSelectField
        value={value}
        onChange={handleChange}
        placeholder="Controlled select"
      >
        <option value="Option 1">Option 1</option>
        <option value="Option 2">Option 2</option>
        <option value="Option 3">Option 3</option>
      </NativeSelectField>
    </NativeSelectRoot>
  )
}
