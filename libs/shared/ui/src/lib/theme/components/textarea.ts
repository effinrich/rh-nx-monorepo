import { getColorVar, mode, StyleFunctionProps } from '@chakra-ui/theme-tools'

const variants = {
  outline: (props: StyleFunctionProps) => ({
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
  }),
  filled: (props: StyleFunctionProps) => ({
    border: '2px solid',
    borderColor: 'transparent',
    bg: mode('gray.100', 'whiteAlpha.50')(props),
    _hover: {
      bg: mode('gray.200', 'whiteAlpha.100')(props)
    },
    _focusVisible: {
      borderColor: mode('primary.600', 'primary.200')(props)
    }
  }),
  flushed: (props: StyleFunctionProps) => ({
    _focusVisible: {
      borderColor: mode('primary.600', 'primary.200')(props)
    }
  })
}

export default {
  variants,
  defaultProps: {
    colorPalette: 'primary'
  }
}
