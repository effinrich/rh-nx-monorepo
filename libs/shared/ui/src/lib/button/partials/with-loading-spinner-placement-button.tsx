import { Stack } from '@chakra-ui/react'

import { Button } from '../button'

export function WithLoadingSpinnerPlacementButton() {
  return (
    <Stack direction="row" gap={4} align="center">
      <Button
        loading
        loadingText="Loading"
        colorPalette="teal"
        variant="outline"
        spinnerPlacement="start"
      >
        Submit
      </Button>
      <Button
        loading
        loadingText="Loading"
        colorPalette="teal"
        variant="outline"
        spinnerPlacement="end"
      >
        Continue
      </Button>
    </Stack>
  )
}
