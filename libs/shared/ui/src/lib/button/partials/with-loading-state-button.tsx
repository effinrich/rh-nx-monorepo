import { Stack } from '@chakra-ui/react'

import { Button } from '../button'

export function WithLoadingStateButton() {
  return (
    <Stack direction="row" gap={4}>
      <Button loading colorPalette="teal" variant="solid">
        Email
      </Button>
      <Button
        loading
        loadingText="Submitting"
        colorPalette="teal"
        variant="outline"
      >
        Submit
      </Button>
    </Stack>
  )
}
