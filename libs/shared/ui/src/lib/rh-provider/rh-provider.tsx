import { ReactNode } from 'react'
import { CSSReset } from '@chakra-ui/css-reset'
import {
  ChakraProvider,
  cookieStorageManagerSSR,
  createLocalStorageManager,
  EnvironmentProviderProps
} from '@chakra-ui/react'

import '@fontsource/inter/variable.css'

interface RhProviderProps {
  cookies?: string
  children: ReactNode
  theme: Record<string, any>
  environment?: EnvironmentProviderProps['environment']
}

const storageManager = createLocalStorageManager('so-color-mode')

export const RhProvider = ({
  children,
  cookies,
  theme,
  ...props
}: RhProviderProps) => {
  const colorModeManager =
    typeof cookies === 'string'
      ? cookieStorageManagerSSR(cookies)
      : storageManager

  return (
    <ChakraProvider
      colorModeManager={colorModeManager}
      theme={theme}
      {...props}
    >
      <CSSReset />
      {children}
    </ChakraProvider>
  )
}
