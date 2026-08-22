import { useDisclosure } from '@chakra-ui/react'

import { Input, InputGroup } from '../input'

export function WithInputElementBugInput() {
  const { open, onToggle } = useDisclosure({ defaultOpen: true })
  return (
    <>
      <button onClick={onToggle}>Toggle element</button>
      <InputGroup startElement={open ? 'O' : undefined}>
        <Input name="input" placeholder="placeholder" />
      </InputGroup>
    </>
  )
}
