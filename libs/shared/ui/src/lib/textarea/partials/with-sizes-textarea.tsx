import { VStack } from '../../../index'

import { Textarea } from '../textarea'

export function WithSizesTextarea() {
  return (
    <VStack align="start" gap={8}>
      {['xs', 'sm', 'md', 'lg'].map(size => (
        <Textarea
          key={size}
          size={size}
          placeholder={`This is a ${size} textarea`}
        />
      ))}
    </VStack>
  )
}
