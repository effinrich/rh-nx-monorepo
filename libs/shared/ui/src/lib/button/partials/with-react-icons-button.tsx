import { MdBuild, MdCall } from 'react-icons/md'
import { Stack } from '@chakra-ui/react'

import { Button } from '../button'

export function WithReactIconsButton() {
  return (
    <Stack direction="row" gap={4} align="center">
      <Button colorPalette="pink" variant="solid">
        <MdBuild />
        Settings
      </Button>
      <Button colorPalette="blue" variant="outline">
        Call us
        <MdCall />
      </Button>
    </Stack>
  )
}
