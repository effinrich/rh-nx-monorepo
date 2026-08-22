import { Stack } from '../../../index'

import { NativeSelectField, NativeSelectRoot } from '../select'

export function SelectStatesSelect() {
  return (
    <Stack>
      <NativeSelectRoot invalid mb={4}>
        <NativeSelectField placeholder="Select option">
          <option value="Option 1">Option 1</option>
          <option value="Option 2">Option 2</option>
          <option value="Option 3">Option 3</option>
        </NativeSelectField>
      </NativeSelectRoot>

      <NativeSelectRoot disabled>
        <NativeSelectField placeholder="Select option">
          <option value="Option 1">Option 1</option>
          <option value="Option 2">Option 2</option>
          <option value="Option 3">Option 3</option>
        </NativeSelectField>
      </NativeSelectRoot>
    </Stack>
  )
}
