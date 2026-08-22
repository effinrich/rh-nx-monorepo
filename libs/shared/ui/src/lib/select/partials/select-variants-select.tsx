import { Stack } from '../../../index'

import { NativeSelectField, NativeSelectRoot } from '../select'

export function SelectVariantsSelect() {
  return (
    <Stack>
      <NativeSelectRoot variant="outline" mb={4}>
        <NativeSelectField placeholder="Select option outline">
          <option value="Option 1">Option 1</option>
          <option value="Option 2">Option 2</option>
          <option value="Option 3">Option 3</option>
        </NativeSelectField>
      </NativeSelectRoot>

      <NativeSelectRoot variant="filled" mb={4}>
        <NativeSelectField placeholder="Select option filled">
          <option value="Option 1">Option 1</option>
          <option value="Option 2">Option 2</option>
          <option value="Option 3">Option 3</option>
        </NativeSelectField>
      </NativeSelectRoot>

      <NativeSelectRoot variant="flushed" mb={4}>
        <NativeSelectField placeholder="Select option flushed">
          <option value="Option 1">Option 1</option>
          <option value="Option 2">Option 2</option>
          <option value="Option 3">Option 3</option>
        </NativeSelectField>
      </NativeSelectRoot>

      <NativeSelectRoot variant="unstyled" mt={4}>
        <NativeSelectField placeholder="Select option unstyled">
          <option value="Option 1">Option 1</option>
          <option value="Option 2">Option 2</option>
          <option value="Option 3">Option 3</option>
        </NativeSelectField>
      </NativeSelectRoot>
    </Stack>
  )
}
