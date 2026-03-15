/* eslint-disable react/no-multi-comp */
'use client'

import * as React from 'react'
import { JSX } from 'react/jsx-runtime'
import { LuMoon, LuSun } from 'react-icons/lu'
import { ClientOnly, IconButton, Skeleton, Span } from '@chakra-ui/react'
import { ThemeProvider, ThemeProviderProps, useTheme } from 'next-themes'

export function ColorModeProvider(
  props: JSX.IntrinsicAttributes & ThemeProviderProps
) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  )
}

export function useColorMode() {
  const { resolvedTheme, setTheme, forcedTheme } = useTheme()
  const colorMode = forcedTheme || resolvedTheme
  const toggleColorMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }
  return {
    colorMode: colorMode,
    setColorMode: setTheme,
    toggleColorMode
  }
}

export function useColorModeValue(light: unknown, dark: unknown) {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? dark : light
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? <LuMoon /> : <LuSun />
}

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof IconButton>
>(function ColorModeButton(props, ref: React.ForwardedRef<HTMLButtonElement>) {
  const { toggleColorMode } = useColorMode()
  return (
    <ClientOnly fallback={<Skeleton boxSize="9" />}>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Toggle color mode"
        size="sm"
        ref={ref}
        {...props}
        css={{
          _icon: {
            width: '5',
            height: '5'
          }
        }}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  )
})

export const LightMode = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof Span>
>(function LightMode(props, ref) {
  return (
    <Span
      color="fg"
      display="contents"
      className="chakra-theme light"
      colorPalette="gray"
      ref={ref}
      {...props}
    />
  )
})

export const DarkMode = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof Span>
>(function DarkMode(props, ref) {
  return (
    <Span
      color="fg"
      display="contents"
      className="chakra-theme dark"
      colorPalette="gray"
      ref={ref}
      {...props}
    />
  )
})
