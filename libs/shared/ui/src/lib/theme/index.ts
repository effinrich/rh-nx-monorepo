// import 'focus-visible/dist/focus-visible'

import { createSystem, defaultConfig, defineConfig, defineRecipe } from '@chakra-ui/react'

import breakpoints from './foundations/breakpoints'
import colors from './foundations/colors'
import radii from './foundations/radius'
import shadows from './foundations/shadows'
import sizes from './foundations/sizes'
import spacing from './foundations/spacing'
import typography from './foundations/typography'

// Custom button recipe extending Chakra v3 defaults with project-specific variants
const buttonRecipe = defineRecipe({
  variants: {
    variant: {
      'ghost-on-accent': {
        fontWeight: 'medium',
        color: 'gray.700',
        _hover: { bg: 'primary.50' },
        '&[data-active]': {
          color: 'primary.700',
          bg: 'primary.50'
        }
      },
      'primary-on-accent': {
        fontWeight: 'medium',
        bg: 'primary.50',
        color: 'primary.600',
        _hover: { bg: 'primary.100' },
        _active: { bg: 'primary.100' }
      },
      'secondary-on-accent': {
        color: 'white',
        borderColor: 'primary.50',
        borderWidth: '1px',
        _hover: { bg: 'whiteAlpha.200' },
        _active: { bg: 'whiteAlpha.200' }
      },
      'link-on-accent': {
        padding: '0',
        height: 'auto',
        lineHeight: 'normal',
        verticalAlign: 'baseline',
        color: 'primary.50',
        _hover: { color: 'white' },
        _active: { color: 'white' }
      }
    }
  }
})

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
    recipes: {
      button: buttonRecipe
    },
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
        // Brand color palettes — required for colorPalette="primary" etc. to work in v3
        primary: {
          contrast: { value: { _light: 'white', _dark: 'white' } },
          fg: { value: { _light: '{colors.primary.700}', _dark: '{colors.primary.200}' } },
          subtle: { value: { _light: '{colors.primary.50}', _dark: '{colors.primary.900}' } },
          muted: { value: { _light: '{colors.primary.100}', _dark: '{colors.primary.800}' } },
          emphasized: { value: { _light: '{colors.primary.300}', _dark: '{colors.primary.600}' } },
          solid: { value: { _light: '{colors.primary.600}', _dark: '{colors.primary.600}' } },
          focusRing: { value: { _light: '{colors.primary.600}', _dark: '{colors.primary.500}' } },
          border: { value: { _light: '{colors.primary.500}', _dark: '{colors.primary.400}' } }
        },
        error: {
          contrast: { value: { _light: 'white', _dark: 'white' } },
          fg: { value: { _light: '{colors.error.700}', _dark: '{colors.error.300}' } },
          subtle: { value: { _light: '{colors.error.50}', _dark: '{colors.error.900}' } },
          muted: { value: { _light: '{colors.error.100}', _dark: '{colors.error.800}' } },
          emphasized: { value: { _light: '{colors.error.300}', _dark: '{colors.error.700}' } },
          solid: { value: { _light: '{colors.error.600}', _dark: '{colors.error.600}' } },
          focusRing: { value: { _light: '{colors.error.500}', _dark: '{colors.error.500}' } },
          border: { value: { _light: '{colors.error.500}', _dark: '{colors.error.400}' } }
        },
        success: {
          contrast: { value: { _light: 'white', _dark: 'white' } },
          fg: { value: { _light: '{colors.success.700}', _dark: '{colors.success.300}' } },
          subtle: { value: { _light: '{colors.success.50}', _dark: '{colors.success.900}' } },
          muted: { value: { _light: '{colors.success.100}', _dark: '{colors.success.800}' } },
          emphasized: { value: { _light: '{colors.success.300}', _dark: '{colors.success.700}' } },
          solid: { value: { _light: '{colors.success.600}', _dark: '{colors.success.600}' } },
          focusRing: { value: { _light: '{colors.success.500}', _dark: '{colors.success.500}' } },
          border: { value: { _light: '{colors.success.500}', _dark: '{colors.success.400}' } }
        },
        warning: {
          contrast: { value: { _light: '{colors.warning.900}', _dark: 'black' } },
          fg: { value: { _light: '{colors.warning.700}', _dark: '{colors.warning.300}' } },
          subtle: { value: { _light: '{colors.warning.50}', _dark: '{colors.warning.900}' } },
          muted: { value: { _light: '{colors.warning.100}', _dark: '{colors.warning.800}' } },
          emphasized: { value: { _light: '{colors.warning.300}', _dark: '{colors.warning.700}' } },
          solid: { value: { _light: '{colors.warning.500}', _dark: '{colors.warning.500}' } },
          focusRing: { value: { _light: '{colors.warning.500}', _dark: '{colors.warning.500}' } },
          border: { value: { _light: '{colors.warning.500}', _dark: '{colors.warning.400}' } }
        },
        // Legacy semantic tokens referenced by UI components
        'bg-canvas': { value: { _light: 'white', _dark: '{colors.gray.900}' } },
        'bg-surface': { value: { _light: 'white', _dark: '{colors.gray.800}' } },
        'bg-subtle': { value: { _light: '{colors.gray.50}', _dark: '{colors.gray.700}' } },
        'bg-muted': { value: { _light: '{colors.gray.100}', _dark: '{colors.gray.600}' } },
        'bg-accent': { value: { _light: '{colors.primary.600}', _dark: '{colors.primary.600}' } },
        'bg-accent-subtle': { value: { _light: '{colors.primary.50}', _dark: '{colors.primary.900}' } },
        'bg-accent-muted': { value: { _light: '{colors.primary.400}', _dark: '{colors.primary.400}' } },
        'on-accent': { value: { _light: '{colors.gray.700}', _dark: '{colors.gray.100}' } },
        'on-accent-muted': { value: { _light: '{colors.gray.500}', _dark: '{colors.gray.400}' } },
        'on-accent-subtle': { value: { _light: '{colors.gray.700}', _dark: '{colors.gray.300}' } },
        accent: { value: { _light: '{colors.primary.500}', _dark: '{colors.primary.200}' } }
      }
    }
  }
})

export const system = createSystem(defaultConfig, customConfig)

/**
 * Resolve a color token path (e.g. 'gray.500') to its raw value
 * using the public system.token() API.
 */
export function resolveColorToken(colorToken: string): string {
  const resolved = system.token(`colors.${colorToken}`)
  if (resolved == null && process.env['NODE_ENV'] === 'development') {
    console.warn(
      `[resolveColorToken] No token found for "colors.${colorToken}". Check your theme configuration.`
    )
  }
  // Fall back to the token string so Chakra can still attempt CSS-layer resolution
  return resolved ?? colorToken
}

/**
 * Return all shade keys for a top-level color name (e.g. 'gray' → ['25','50','100',...]).
 *
 * Note: system.token() resolves individual token values but does not support enumeration
 * of child keys under a palette. The colors foundations file is the canonical source of
 * palette structure, so it is read directly here for shade enumeration only.
 */
export function getColorShades(colorName: string): string[] {
  const colorValue = (colors as Record<string, unknown>)[colorName]
  return typeof colorValue === 'object' && colorValue !== null
    ? Object.keys(colorValue)
    : []
}
