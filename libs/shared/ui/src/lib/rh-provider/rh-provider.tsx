import '@fontsource-variable/inter'

import type { ComponentProps } from 'react'
import { ChakraProvider } from '@chakra-ui/react'

import { ColorModeProvider } from '../color-mode/color-mode-provider'
import { system } from '../theme'
import { Toaster } from '../toaster/toaster'

export type RhProviderProps = ComponentProps<typeof ColorModeProvider> & {
  chakraSystem?: ComponentProps<typeof ChakraProvider>['value']
}

export function RhProvider({
  children,
  chakraSystem = system,
  ...themeProps
}: RhProviderProps) {
  return (
    <ChakraProvider value={chakraSystem}>
      <ColorModeProvider {...themeProps}>
        {children}
        <Toaster />
      </ColorModeProvider>
    </ChakraProvider>
  )
}
