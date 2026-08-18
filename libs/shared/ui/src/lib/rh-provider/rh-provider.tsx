'use client'

import { ReactNode } from 'react'
import { ChakraProvider, SystemContext } from '@chakra-ui/react'
import { ThemeProviderProps } from 'next-themes'

import { ColorModeProvider } from '../color-mode/color-mode'
import { system } from '../theme'
import { Toaster } from '../toaster/toaster'

import '@fontsource-variable/inter'

export interface RhProviderProps extends Pick<
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
  /** @deprecated Use `value` — accepted during v2 → v3 migration */
  theme?: SystemContext
}

export function RhProvider({
  children,
  value,
  theme,
  ...themeProps
}: RhProviderProps) {
  return (
    <ChakraProvider value={value ?? theme ?? system}>
      <ColorModeProvider {...themeProps}>
        {children}
        <Toaster />
      </ColorModeProvider>
    </ChakraProvider>
  )
}
