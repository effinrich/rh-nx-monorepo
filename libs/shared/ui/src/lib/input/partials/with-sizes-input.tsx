import { Stack } from '@chakra-ui/react'

import { Input } from '../input'

export function WithSizesInput() {
  return (
    <Stack align="start">
      {['xs', 'sm', 'md', 'lg'].map(size => (
        <Input
          key={size}
          size={size}
          placeholder="This is an input component"
        />
      ))}
    </Stack>
  )
}
