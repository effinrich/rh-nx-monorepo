import { Stack } from '@chakra-ui/react'

import { Input, InputGroup } from '../input'

export function WithInputAddonInput() {
  return (
    <Stack align="start">
      <InputGroup startAddon="+234">
        <Input placeholder="Phone number..." />
      </InputGroup>

      <InputGroup size="sm" startAddon="https://" endAddon=".com">
        <Input placeholder="website.com" />
      </InputGroup>
    </Stack>
  )
}
