import '@fontsource-variable/inter'

import { ReactNode } from 'react'
import { ChakraProvider, SystemContext } from '@chakra-ui/react'
import { ThemeProviderProps } from 'next-themes'

import { ColorModeProvider } from '../color-mode/color-mode-provider'
import { system } from '../theme'
import { Toaster } from '../toaster/toaster'

export interface RhProviderProps
  extends Pick<
    ThemeProviderProps,
    | 'forcedTheme'
    | 'defaultTheme'
    | 'attribute'
    | 'storageKey'
    | 'enableSystem'
    | 'enableColorScheme'
    | 'disableTransitionOnChange'
    | 'themes'
    | 'nonce'
  > {
  children?: ReactNode
  value?: SystemContext
}

export function RhProvider({
  children,
  value = system,
  ...themeProps
}: RhProviderProps) {
  return (
    <ChakraProvider value={value}>
      <ColorModeProvider {...themeProps}>
        {children}
        <Toaster />
      </ColorModeProvider>
    </ChakraProvider>
  )
}
