import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools'

const baseStyle = (props: StyleFunctionProps) => {
  const { colorScheme: c } = props
  return {
    label: {
      color: 'muted',
      fontWeight: 'medium'
    },
    control: {
      bg: mode('white', 'gray.800')(props),
      borderRadius: 'base',
      _checked: {
        bg: mode(`${c}.600`, `${c}.200`)(props),
        borderColor: mode(`${c}.600`, `${c}.200`)(props),
        _hover: {
          bg: mode(`${c}.700`, `${c}.300`)(props),
          borderColor: mode(`${c}.700`, `${c}.300`)(props)
        }
      }
    }
  }
}

const sizes = {
  md: {
    label: {
      fontSize: 'sm'
    }
  }
}

const defaultProps = {
  colorScheme: 'primary'
}

export default {
  baseStyle,
  sizes,
  defaultProps
}
