import { cssVar, defineStyle } from '@chakra-ui/styled-system'
import { transparentize } from '@chakra-ui/theme-tools'

const baseStyle = {
  textTransform: 'lowercase',
  '::first-letter': {
    textTransform: 'uppercase'
  },
  fontWeight: 'medium',
  borderRadius: '2xl'
}

const sizes = {
  lg: {
    fontSize: 'sm',
    px: '3',
    py: '1'
  },
  md: {
    fontSize: 'sm',
    lineHeight: '1.25rem',
    px: '2.5',
    py: '0.5'
  },
  sm: {
    fontSize: 'xs',
    lineHeight: '1.5',
    px: '2',
    py: '0.5'
  }
}

const $bg = cssVar('badge-bg')
const $fg = cssVar('badge-color')

const variants = {
  subtle: defineStyle(props => {
    const { colorScheme: c, theme } = props
    const dark = transparentize(`${c}.50`, 0.6)(theme)
    return {
      [$bg.variable]: `colors.${c}.50`,
      [$fg.variable]: `colors.${c}.700`,
      _dark: {
        [$bg.variable]: dark,
        [$fg.variable]: `colors.whiteAlpha.800`
      },
      bg: $bg.reference,
      color: $fg.reference
    }
  })
}

const defaultProps = {
  size: 'md',
  variant: 'subtle'
}

export default {
  baseStyle,
  defaultProps,
  variants,
  sizes
}
