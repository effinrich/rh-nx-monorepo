import { LuArrowRight, LuMail } from 'react-icons/lu'
import { Stack } from '@chakra-ui/react'

import { Button } from '../button'

export function WithIconButton() {
  return (
    <Stack direction="row" gap={4}>
      <Button colorPalette="teal" variant="solid">
        <LuMail />
        Email
      </Button>
      <Button colorPalette="teal" variant="outline">
        Call us
        <LuArrowRight />
      </Button>
    </Stack>
  )
}
