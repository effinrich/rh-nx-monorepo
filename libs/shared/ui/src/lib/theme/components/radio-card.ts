import {
  mode,
  StyleFunctionProps,
  transparentize
} from '@chakra-ui/theme-tools'

const baseStyle = (props: StyleFunctionProps) => ({
  borderWidth: '1px',
  borderRadius: 'lg',
  p: '4',
  bg: 'bg-surface',
  transitionProperty: 'common',
  transitionDuration: 'normal',
  _hover: { borderColor: mode('gray.300', 'gray.600')(props) },
  _checked: {
    borderColor: mode('primary.500', 'primary.200')(props),
    boxShadow: mode(
      `0px 0px 0px 1px ${transparentize(`primary.500`, 1.0)(props.theme)}`,
      `0px 0px 0px 1px ${transparentize(`primary.200`, 1.0)(props.theme)}`
    )(props)
  }
})

export default {
  baseStyle
}
