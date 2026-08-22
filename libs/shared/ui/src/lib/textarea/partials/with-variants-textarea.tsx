import { Stack } from '../../../index'

import { Textarea } from '../textarea'

export function WithVariantsTextarea() {
  return (
    <Stack align="start" gap={8}>
      <Textarea variant="outline" placeholder="Outline" />
      <Textarea variant="filled" placeholder="Filled" />
      <Textarea variant="flushed" placeholder="Flushed" />
      <Textarea variant="unstyled" placeholder="Unstyled" />
    </Stack>
  )
}
