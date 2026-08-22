import { Stack } from '../../../index'

import { NativeSelectField, NativeSelectRoot } from '../select'

export function SelectSizesSelect() {
  return (
    <Stack gap={6}>
      {['xs', 'sm', 'md', 'lg'].map(size => (
        <NativeSelectRoot size={size} key={size}>
          <NativeSelectField placeholder={`${size} size`} />
        </NativeSelectRoot>
      ))}
    </Stack>
  )
}
