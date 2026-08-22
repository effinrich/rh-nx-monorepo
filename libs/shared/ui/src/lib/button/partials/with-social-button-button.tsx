import { MdFacebook } from 'react-icons/md'
import { Stack } from '@chakra-ui/react'

import { Button } from '../button'

export function WithSocialButtonButton() {
  return (
    <Stack direction="row">
      <Button colorPalette="facebook">
        <MdFacebook />
        Facebook
      </Button>
    </Stack>
  )
}
