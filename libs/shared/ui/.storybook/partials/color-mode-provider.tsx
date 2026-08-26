import type { ThemeProviderProps } from 'next-themes'
import { ThemeProvider } from 'next-themes'

export type ColorModeProviderProps = ThemeProviderProps

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
