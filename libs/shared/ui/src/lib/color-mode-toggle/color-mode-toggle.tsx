import { useColorMode } from '@chakra-ui/react'

import { IconButton } from '../icon-button/icon-button'
import { MoonIcon } from '../icons/src/Moon'
import { SunIcon } from '../icons/src/Sun'

export const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton
      onClick={toggleColorMode}
      size="md"
      aria-label="theme toggle"
      colorScheme="primary"
    >
      {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
    </IconButton>
  )
}

export default ColorModeToggle
