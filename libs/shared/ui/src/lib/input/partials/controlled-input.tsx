import * as React from 'react'

import { Text } from '@chakra-ui/react'

import { Input } from '../input'

export function ControlledInput() {
  const [value, setValue] = React.useState('Starting...')
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value)

  return (
    <>
      <Input
        value={value}
        onChange={handleChange}
        placeholder="Controlled input"
      />
      <Text fontSize="13px" pl={4} pt={2}>
        {value}
      </Text>
    </>
  )
}
