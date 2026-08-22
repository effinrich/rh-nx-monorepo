import { Stack } from '@chakra-ui/react'

import { Input } from '../input'

export function WithVariantsInput() {
  return (
    <Stack align="start">
      <Input variant="outline" placeholder="Outline" />
      <Input variant="filled" placeholder="Filled" />
      <Input variant="flushed" placeholder="Flushed" />
      <Input variant="unstyled" placeholder="Unstyled" />
    </Stack>
  )
}
