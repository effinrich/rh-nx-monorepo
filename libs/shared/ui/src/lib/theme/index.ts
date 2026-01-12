// import 'focus-visible/dist/focus-visible'

import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

import breakpoints from './foundations/breakpoints'
import colors from './foundations/colors'
import radii from './foundations/radius'
import shadows from './foundations/shadows'
import sizes from './foundations/sizes'
import spacing from './foundations/spacing'
import typography from './foundations/typography'

// Convert v2 color palette to v3 token format
const convertColorsToTokens = (colorObj: Record<string, unknown>) => {
  const tokens: Record<string, { value: string }> = {}

  for (const [key, value] of Object.entries(colorObj)) {
    if (typeof value === 'string') {
      tokens[key] = { value }
    } else if (typeof value === 'object' && value !== null) {
      for (const [shade, shadeValue] of Object.entries(
        value as Record<string, string>
      )) {
        tokens[`${key}.${shade}`] = { value: shadeValue }
      }
    }
  }

  return tokens
}

// Convert object to v3 token format with string values
const convertToStringTokens = (obj: Record<string, string | number>) => {
  const tokens: Record<string, { value: string }> = {}
  for (const [key, value] of Object.entries(obj)) {
    tokens[key] = { value: String(value) }
  }
  return tokens
}

// Convert sizes object which may have nested container
const convertSizesToTokens = (obj: Record<string, unknown>) => {
  const tokens: Record<string, { value: string }> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' || typeof value === 'number') {
      tokens[key] = { value: String(value) }
    } else if (typeof value === 'object' && value !== null) {
      // Handle nested objects like container sizes
      for (const [nestedKey, nestedValue] of Object.entries(
        value as Record<string, string>
      )) {
        tokens[`${key}.${nestedKey}`] = { value: String(nestedValue) }
      }
    }
  }
  return tokens
}

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: convertColorsToTokens(colors),
      fonts: convertToStringTokens(typography.fonts),
      fontSizes: convertToStringTokens(typography.fontSizes),
      fontWeights: convertToStringTokens(
        typography.fontWeights as Record<string, string | number>
      ),
      lineHeights: convertToStringTokens(
        typography.lineHeights as Record<string, string | number>
      ),
      letterSpacings: convertToStringTokens(typography.letterSpacings),
      spacing: convertToStringTokens(spacing as Record<string, string>),
      sizes: convertSizesToTokens(sizes),
      radii: convertToStringTokens(radii),
      shadows: convertToStringTokens(shadows),
      breakpoints: convertToStringTokens(breakpoints)
    },
    semanticTokens: {
      colors: {
        primary: {
          value: { base: '{colors.primary.500}', _dark: '{colors.primary.400}' }
        },
        'primary.fg': {
          value: { base: '{colors.white}', _dark: '{colors.white}' }
        },
        'primary.muted': {
          value: { base: '{colors.primary.100}', _dark: '{colors.primary.800}' }
        },
        'primary.subtle': {
          value: { base: '{colors.primary.50}', _dark: '{colors.primary.900}' }
        },
        'primary.emphasized': {
          value: { base: '{colors.primary.600}', _dark: '{colors.primary.300}' }
        },
        error: {
          value: { base: '{colors.error.500}', _dark: '{colors.error.400}' }
        },
        'error.fg': {
          value: { base: '{colors.white}', _dark: '{colors.white}' }
        },
        success: {
          value: { base: '{colors.success.500}', _dark: '{colors.success.400}' }
        },
        'success.fg': {
          value: { base: '{colors.white}', _dark: '{colors.white}' }
        },
        warning: {
          value: { base: '{colors.warning.500}', _dark: '{colors.warning.400}' }
        },
        'warning.fg': {
          value: { base: '{colors.black}', _dark: '{colors.black}' }
        }
      }
    }
  }
})

export const system = createSystem(defaultConfig, customConfig)

// Export theme as alias for backward compatibility
export const theme = system
