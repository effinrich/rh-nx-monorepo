import { useState } from 'react'

import { Text } from '../../../index'

import { Textarea } from '../textarea'

export function WithControlledTextarea() {
  const [value, setValue] = useState('')

  const handleInputChange = (e: { target: { value: string } }) => {
    setValue(e.target.value)
  }
  return (
    <>
      <Text mb="8px">Value: {value}</Text>
      <Textarea
        value={value}
        onChange={handleInputChange}
        placeholder="Here is a sample placeholder"
        size="sm"
      />
    </>
  )
}
