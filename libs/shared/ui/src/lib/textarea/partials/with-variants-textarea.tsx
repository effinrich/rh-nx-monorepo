import { Stack } from '../../../index'
import { Textarea } from '../textarea'

export function WithVariantsTextarea() {
  return (
    <Stack align="start" gap={8}>
      <Textarea variant="outline" placeholder="Outline" />
      <Textarea variant="subtle" placeholder="Subtle" />
      <Textarea variant="flushed" placeholder="Flushed" />
      <Textarea unstyled placeholder="Unstyled" />
    </Stack>
  )
}
