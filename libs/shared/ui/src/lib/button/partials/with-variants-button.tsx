import { HStack } from '@chakra-ui/react'

import { Button } from '../button'

export function WithVariantsButton() {
  return (
    <HStack gap="24px">
      <Button colorPalette="primary">Primary</Button>
      <Button variant="primary-on-accent">Primary on accent</Button>
      <Button variant="outline">Secondary</Button>
      <Button colorPalette="teal" variant="solid">
        Solid
      </Button>
      <Button colorPalette="teal" variant="outline">
        Outline
      </Button>
      <Button colorPalette="teal" variant="ghost">
        Ghost
      </Button>
      <Button colorPalette="teal" variant="plain">
        Link
      </Button>
      <Button colorPalette="teal" variant="unstyled">
        Unstyled
      </Button>
    </HStack>
  )
}
