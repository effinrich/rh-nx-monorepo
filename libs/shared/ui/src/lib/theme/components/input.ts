import { getColorVar, mode, StyleFunctionProps } from '@chakra-ui/theme-tools'

const variants = {
  outline: (props: StyleFunctionProps) => ({
    field: {
      borderRadius: 'lg',
      bg: mode('white', 'gray.800')(props),
      _placeholder: { color: 'gray.400' },
      _hover: { borderColor: mode('gray.300', 'gray.600')(props) },
      _focusVisible: {
        borderColor: mode('primary.600', 'primary.200')(props),
        boxShadow: `0 0 0 1px ${getColorVar(
          props.theme,
          mode('primary.600', 'primary.200')(props)
        )}`
      }
    },
    addon: {
      borderRadius: 'lg',
      bg: mode('gray.50', 'gray.700')(props)
    }
  }),
  filled: (props: StyleFunctionProps) => {
    if (props.colorScheme === 'gray') {
      return {
        field: {
          bg: mode('white', 'gray.800')(props),
          _hover: {
            borderColor: mode('gray.200', 'gray.700')(props),
            bg: mode('white', 'gray.700')(props)
          },
          _focusVisible: {
            borderColor: 'accent',
            bg: mode('white', 'gray.800')(props)
          }
        }
      }
    }
    return {
      field: {
        bg: 'bg-accent-subtle',
        color: 'on-accent',
        _placeholder: {
          color: 'gray.400'
        },
        _hover: {
          borderColor: 'primary.400',
          bg: 'bg-accent-subtle'
        },
        _focusVisible: {
          bg: 'bg-accent-subtle',
          borderColor: mode('primary.600', 'primary.200')(props)
        }
      }
    }
  }
}

const sizes = {
  lg: {
    field: {
      fontSize: 'md',
      borderRadius: 'lg'
    }
  }
}

export default {
  variants,
  sizes,
  defaultProps: {
    colorScheme: 'primary'
  }
}
