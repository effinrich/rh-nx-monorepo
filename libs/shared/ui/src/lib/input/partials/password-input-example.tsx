import * as React from 'react'
import { Button } from '@chakra-ui/react'

import { Input, InputGroup } from '../input'

export function PasswordInputExample() {
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)

  return (
    <InputGroup
      size="md"
      endElement={
        <Button onClick={handleClick}>{show ? 'Hide' : 'Show'}</Button>
      }
    >
      <Input type={show ? 'text' : 'password'} placeholder="Enter password" />
    </InputGroup>
  )
}
