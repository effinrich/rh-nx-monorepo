import {
  mode,
  StyleFunctionProps,
  transparentize
} from '@chakra-ui/theme-tools'

const baseStyle = {
  ':focus:not(:focus-visible)': {
    boxShadow: 'none'
  }
}

const sizes = {
  lg: {
    h: '12',
    minW: '12',
    fontSize: 'lg',
    px: '6'
  },
  md: {
    h: '10',
    minW: '10',
    fontSize: 'md',
    px: '4'
  },
  sm: {
    h: '8',
    minW: '8',
    fontSize: 'sm',
    px: '3'
  },
  xs: {
    h: '6',
    minW: '6',
    fontSize: 'xs',
    px: '2'
  }
}

interface AccessibleColor {
  bg?: string
  color?: string
  hoverBg?: string
  activeBg?: string
}

const accessibleColorMap: { [key: string]: AccessibleColor } = {
  yellow: {
    bg: 'yellow.400',
    color: 'black',
    hoverBg: 'yellow.500',
    activeBg: 'yellow.600'
  },
  cyan: {
    bg: 'cyan.400',
    color: 'black',
    hoverBg: 'cyan.500',
    activeBg: 'cyan.600'
  }
}

const variants = {
  solid: (props: StyleFunctionProps) => {
    const { colorScheme: c } = props

    if (c === 'gray') {
      const bg = mode(`gray.100`, `whiteAlpha.200`)(props)

      return {
        bg,
        color: mode(`gray.800`, `whiteAlpha.900`)(props),
        _hover: {
          bg: mode(`gray.200`, `whiteAlpha.300`)(props),
          _disabled: {
            bg
          }
        },
        _active: { bg: mode(`gray.300`, `whiteAlpha.400`)(props) }
      }
    }

    if (c === 'secondary') {
      const bg = mode(`secondary.500`, `gray.100`)(props)

      return {
        bg,
        color: mode(`secondary.700`, `whiteAlpha.900`)(props),
        _hover: {
          bg: mode(`secondary.600`, `whiteAlpha.300`)(props),
          _disabled: {
            bg
          }
        },
        _active: { bg: mode(`secondary.600`, `whiteAlpha.400`)(props) }
      }
    }

    const {
      bg = `${c}.600`,
      color = 'white',
      hoverBg = `${c}.700`,
      activeBg = `${c}.800`
    } = accessibleColorMap[c] ?? {}

    const background = mode(bg, `${c}.200`)(props)

    return {
      bg: background,
      color: mode(color, `gray.800`)(props),
      _hover: {
        bg: mode(hoverBg, `${c}.300`)(props),
        _disabled: {
          bg: background
        }
      },
      _active: { bg: mode(activeBg, `${c}.400`)(props) }
    }
  },
  primary: (props: StyleFunctionProps) =>
    props.theme.components['Button']['variants']['solid']({
      ...props,
      variant: 'solid',
      colorScheme: 'primary'
    }),
  'primary-on-accent': () => ({
    fontWeight: 'medium',
    bg: 'primary.50',
    color: 'primary.600',
    _hover: { bg: 'primary.100' },
    _active: { bg: 'primary.100' }
  }),
  'zap-on-accent': () => ({
    fontWeight: 'medium',
    bg: 'zap.500',
    color: 'galaxy.500',
    _hover: { bg: 'zap.500' },
    _active: { bg: 'zap.500' }
  }),
  secondary: (props: StyleFunctionProps) =>
    props.theme.components['Button']['variants']['outline']({
      ...props,
      variant: 'outline',
      colorScheme: 'gray'
    }),
  'secondary-on-accent': {
    color: 'white',
    borderColor: 'primary.50',
    borderWidth: '1px',
    _hover: { bg: 'whiteAlpha.200' },
    _active: { bg: 'whiteAlpha.200' }
  },
  // outline: (props: StyleFunctionProps) => ({
  //   color: 'emphasized',
  //   bg: mode('white', 'gray.800')(props),
  //   _hover: {
  //     bg: mode(
  //       darken('gray.50', 1)(props.theme),
  //       transparentize('gray.700', 0.4)(props.theme)
  //     )(props)
  //   },
  //   _checked: {
  //     bg: mode('gray.100', 'gray.700')(props)
  //   },
  //   _active: {
  //     bg: mode('gray.100', 'gray.700')(props)
  //   }
  // }),
  ghost: (props: StyleFunctionProps) => {
    const { colorScheme: c, theme } = props

    if (c === 'gray') {
      return {
        color: mode(`gray.800`, `whiteAlpha.900`)(props),
        _hover: {
          bg: mode(`gray.100`, `whiteAlpha.200`)(props)
        },
        _active: { bg: mode(`gray.200`, `whiteAlpha.300`)(props) }
      }
    }

    const darkHoverBg = transparentize(`${c}.200`, 0.12)(theme)
    const darkActiveBg = transparentize(`${c}.200`, 0.24)(theme)

    return {
      color: mode(`${c}.600`, `${c}.200`)(props),
      _hover: {
        bg: mode(`${c}.50`, darkHoverBg)(props)
      },
      _active: {
        bg: mode(`${c}.100`, darkActiveBg)(props)
      }
    }
  },
  'ghost-on-accent': (props: StyleFunctionProps) => ({
    fontWeight: 'medium',
    color: 'gray.700',
    _hover: {
      bg: transparentize('primary.50', 0.67)(props.theme)
    },
    _activeLink: {
      color: 'primary.700',
      bg: 'bg-accent-subtle'
    }
  }),
  link: (props: StyleFunctionProps) => {
    if (props.colorScheme === 'gray') {
      return {
        color: 'muted',
        _hover: {
          textDecoration: 'none',
          color: 'default'
        },
        _active: {
          color: 'default'
        }
      }
    }
    return {
      color: mode(
        `${props.colorScheme}.600`,
        `${props.colorScheme}.200`
      )(props),
      _hover: {
        color: mode(
          `${props.colorScheme}.700`,
          `${props.colorScheme}.300`
        )(props),
        textDecoration: 'none'
      },
      _active: {
        color: mode(
          `${props.colorScheme}.700`,
          `${props.colorScheme}.300`
        )(props)
      }
    }
  },
  'link-on-accent': () => {
    return {
      padding: 0,
      height: 'auto',
      lineHeight: 'normal',
      verticalAlign: 'baseline',
      color: 'primary.50',
      _hover: {
        color: 'white'
      },
      _active: {
        color: 'white'
      }
    }
  }
}

export default {
  baseStyle,
  variants,
  sizes
}
