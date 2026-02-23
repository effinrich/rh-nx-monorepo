'use client'

import { ReactNode } from 'react'
import { ChakraProvider, defaultSystem, SystemContext } from '@chakra-ui/react'
import { ThemeProviderProps } from 'next-themes'

import { ColorModeProvider } from './color-mode'

import '@fontsource/inter/variable.css'

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
  value,
  ...themeProps
}: RhProviderProps) {
  return (
    <ChakraProvider value={value ?? defaultSystem}>
      <ColorModeProvider {...themeProps}>{children}</ColorModeProvider>
    </ChakraProvider>
  )
}
