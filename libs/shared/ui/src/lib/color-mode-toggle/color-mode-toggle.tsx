import { IconButton } from '../icon-button/icon-button'
import { MoonIcon } from '../icons/src/Moon'
import { SunIcon } from '../icons/src/Sun'
import { useColorMode } from '../color-mode/color-mode'

export const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton
      onClick={toggleColorMode}
      size="md"
      aria-label="theme toggle"
      colorPalette="primary"
    >
      {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
    </IconButton>
  )
}

export default ColorModeToggle
