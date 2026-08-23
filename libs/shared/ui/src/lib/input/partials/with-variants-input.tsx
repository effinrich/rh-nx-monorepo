import { Stack } from '@chakra-ui/react'

import { Input } from '../input'

export function WithVariantsInput() {
  return (
    <Stack align="start">
      <Input variant="outline" placeholder="Outline" />
      <Input variant="subtle" placeholder="Subtle" />
      <Input variant="flushed" placeholder="Flushed" />
      <Input unstyled placeholder="Unstyled" />
    </Stack>
  )
}
