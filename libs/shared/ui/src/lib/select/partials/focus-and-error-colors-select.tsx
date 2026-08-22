import { Stack } from '../../../index'

import { NativeSelectField, NativeSelectRoot } from '../select'

export function FocusAndErrorColorsSelect() {
  return (
    <Stack>
      <NativeSelectRoot>
        <NativeSelectField placeholder="Here is a sample placeholder" />
      </NativeSelectRoot>

      <NativeSelectRoot invalid>
        <NativeSelectField placeholder="Here is a sample placeholder" />
      </NativeSelectRoot>
    </Stack>
  )
}
