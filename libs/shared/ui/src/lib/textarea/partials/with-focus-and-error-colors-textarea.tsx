import { Stack } from '../../../index'

import { Textarea } from '../textarea'

export function WithFocusAndErrorColorsTextarea() {
  return (
    <Stack align="start" gap={10}>
      <Textarea
        focusBorderColor="lime"
        placeholder="Here is a sample placeholder"
      />

      <Textarea
        focusBorderColor="pink.400"
        placeholder="Here is a sample placeholder"
      />

      <Textarea
        isInvalid
        errorBorderColor="red.300"
        placeholder="Here is a sample placeholder"
      />

      <Textarea
        isInvalid
        errorBorderColor="crimson"
        placeholder="Here is a sample placeholder"
      />
    </Stack>
  )
}
