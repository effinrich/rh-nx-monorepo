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

      <NativeSelectRoot variant="subtle" mb={4}>
        <NativeSelectField placeholder="Select option subtle">
          <option value="Option 1">Option 1</option>
          <option value="Option 2">Option 2</option>
          <option value="Option 3">Option 3</option>
        </NativeSelectField>
      </NativeSelectRoot>

      <NativeSelectRoot variant="plain" mb={4}>
        <NativeSelectField placeholder="Select option plain">
          <option value="Option 1">Option 1</option>
          <option value="Option 2">Option 2</option>
          <option value="Option 3">Option 3</option>
        </NativeSelectField>
      </NativeSelectRoot>

      <NativeSelectRoot unstyled mt={4}>
        <NativeSelectField placeholder="Select option unstyled">
          <option value="Option 1">Option 1</option>
          <option value="Option 2">Option 2</option>
          <option value="Option 3">Option 3</option>
        </NativeSelectField>
      </NativeSelectRoot>
    </Stack>
  )
}
