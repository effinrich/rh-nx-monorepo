import { Stack } from '@chakra-ui/react'

import { Input } from '../input'

export function WithStatesInput() {
  return (
    <Stack align="start">
      <Input placeholder="Idle" />
      <Input invalid placeholder="isInvalid" />
      <Input disabled placeholder="isDisabled" />
      <Input readOnly placeholder="isReadonly" />
    </Stack>
  )
}
