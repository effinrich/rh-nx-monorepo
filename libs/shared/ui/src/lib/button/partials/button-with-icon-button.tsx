import { LuPhone, LuSearch } from 'react-icons/lu'
import { Stack } from '@chakra-ui/react'

import { IconButton } from '../../icon-button/icon-button'

export function ButtonWithIconButton() {
  return (
    <Stack direction="row">
      <IconButton aria-label="Search database">
        <LuSearch />
      </IconButton>

      <IconButton colorPalette="blue" aria-label="Search database">
        <LuSearch />
      </IconButton>

      <IconButton colorPalette="teal" aria-label="Call Segun" size="lg">
        <LuPhone />
      </IconButton>
    </Stack>
  )
}
