import { FieldRoot, Stack } from '../../../index'
import { Textarea } from '../textarea'

export function WithStatesTextarea() {
  return (
    <Stack align="start" gap={8}>
      <Textarea placeholder="Idle" />
      <FieldRoot invalid>
        <Textarea placeholder="invalid" />
      </FieldRoot>
      <Textarea disabled placeholder="disabled" />
      <Textarea readOnly placeholder="readOnly" />
    </Stack>
  )
}
