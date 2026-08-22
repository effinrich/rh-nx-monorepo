import { HStack } from '@chakra-ui/react'

import { Button } from '../button'

export function WithDisabledButton() {
  return (
    <HStack gap="24px">
      <Button disabled colorPalette="teal" variant="solid">
        Button
      </Button>
      <Button disabled colorPalette="teal" variant="outline">
        Button
      </Button>
      <Button disabled colorPalette="teal" variant="ghost">
        Button
      </Button>
      <Button disabled colorPalette="teal" variant="plain">
        Button
      </Button>
    </HStack>
  )
}
