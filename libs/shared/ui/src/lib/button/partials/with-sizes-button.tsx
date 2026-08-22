import { HStack } from '@chakra-ui/react'

import { Button } from '../button'

export function WithSizesButton() {
  return (
    <HStack>
      <Button colorPalette="blue" size="xs">
        Button
      </Button>
      <Button colorPalette="blue" size="sm">
        Button
      </Button>
      <Button colorPalette="blue" size="md">
        Button
      </Button>
      <Button colorPalette="blue" size="lg">
        Button
      </Button>
    </HStack>
  )
}
