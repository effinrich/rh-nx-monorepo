import { Stack } from '@chakra-ui/react'

import { Input } from '../input'

export function WithFocusAndErrorColorsInput() {
  return (
    <Stack align="start" gap="10">
      <Input
        css={{ '--focus-color': 'lime' }}
        placeholder="Here is a sample placeholder"
      />

      <Input
        css={{ '--focus-color': 'colors.pink.400' }}
        placeholder="Here is a sample placeholder"
      />

      <Input
        aria-invalid
        css={{ '--error-color': 'colors.red.300' }}
        placeholder="Here is a sample placeholder"
      />

      <Input
        aria-invalid
        css={{ '--error-color': 'crimson' }}
        placeholder="Here is a sample placeholder"
      />
    </Stack>
  )
}
