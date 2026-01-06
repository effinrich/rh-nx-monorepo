// Chakra UI v3: Provider
// - ChakraProvider now uses value prop instead of theme
// - ColorModeManager replaced with next-themes
// - CSSReset is built-in, no longer needed
// See: https://chakra-ui.com/docs/get-started/migration

import { ReactNode } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'

import '@fontsource/inter/variable.css'

import { system } from '../theme'

interface RhProviderProps {
  children: ReactNode
  defaultColorMode?: 'light' | 'dark' | 'system'
}

export const RhProvider = ({
  children,
  defaultColorMode = 'light'
}: RhProviderProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={defaultColorMode}
      disableTransitionOnChange
    >
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </ThemeProvider>
  )
}

// Legacy provider for backward compatibility (deprecated)
// Use RhProvider with next-themes instead
export const LegacyRhProvider = RhProvider
