import { Stack } from '../../../index'
import { Textarea } from '../textarea'

export function WithStatesTextarea() {
  return (
    <Stack align="start" gap={8}>
      <Textarea placeholder="Idle" />
      <Textarea aria-invalid placeholder="isInvalid" />
      <Textarea disabled placeholder="isDisabled" />
      <Textarea readOnly placeholder="isReadonly" />
    </Stack>
  )
}
