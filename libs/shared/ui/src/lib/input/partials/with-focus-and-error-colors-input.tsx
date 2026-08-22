import { Stack } from '@chakra-ui/react'

import { Input } from '../input'

export function WithFocusAndErrorColorsInput() {
  return (
    <Stack align="start" gap="10">
      <Input
        focusBorderColor="lime"
        placeholder="Here is a sample placeholder"
      />

      <Input
        focusBorderColor="pink.400"
        placeholder="Here is a sample placeholder"
      />

      <Input
        invalid
        errorBorderColor="red.300"
        placeholder="Here is a sample placeholder"
      />

      <Input
        invalid
        errorBorderColor="crimson"
        placeholder="Here is a sample placeholder"
      />
    </Stack>
  )
}
