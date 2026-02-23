import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools'

const baseStyle = (props: StyleFunctionProps) => {
  const { colorPalette: c } = props
  return {
    control: {
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

const defaultProps = {
  colorPalette: 'primary'
}

export default {
  baseStyle,
  defaultProps
}
