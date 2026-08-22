import { Stack } from '../../../index'

import { Textarea } from '../textarea'

export function WithStatesTextarea() {
  return (
    <Stack align="start" gap={8}>
      <Textarea placeholder="Idle" />
      <Textarea isInvalid placeholder="isInvalid" />
      <Textarea disabled placeholder="isDisabled" />
      <Textarea isReadOnly placeholder="isReadonly" />
    </Stack>
  )
}
