import { useColorMode } from './use-color-mode'

export function useColorModeValue<TLight, TDark>(light: TLight, dark: TDark) {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? dark : light
}
