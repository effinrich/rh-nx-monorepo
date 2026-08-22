import { LuCheck, LuPhone } from 'react-icons/lu'
import { Stack } from '@chakra-ui/react'

import { Input, InputGroup } from '../input'

export function WithInputElementInput() {
  return (
    <Stack align="start">
      <InputGroup startElement={<LuPhone color="gray.300" />}>
        <Input type="tel" placeholder="Phone number" />
      </InputGroup>

      <InputGroup
        size="sm"
        startElement="$"
        endElement={<LuCheck color="green.500" />}
      >
        <Input placeholder="Enter amount" />
      </InputGroup>
    </Stack>
  )
}
