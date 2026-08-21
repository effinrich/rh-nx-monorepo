import type { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'

export interface ColorModeProviderProps {
  children: ReactNode
  attribute?: 'class' | 'data-theme'
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  forcedTheme?: string
}

export function ColorModeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'light',
  disableTransitionOnChange = true,
  ...props
}: ColorModeProviderProps) {
  return (
    <ThemeProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      disableTransitionOnChange={disableTransitionOnChange}
      {...props}
    >
      {children}
    </ThemeProvider>
  )
}
