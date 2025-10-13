import { Box, Flex, FlexProps, Grid, GridProps, theme } from '../index'

import '@fontsource/inter/variable.css'

type ColorPaletteProps = FlexProps & { color?: string; name?: string }

export const ColorPalette = (props: ColorPaletteProps) => {
  const { color, name, ...rest } = props

  let colorCode = color
  const [shade, hue] = color!.split('.')

  if (shade && hue) {
    colorCode = theme.colors[shade][hue]
  }

  if (color! in theme.colors && typeof theme.colors[color!] === 'string') {
    colorCode = theme.colors[color!]
  }

  return (
    <Flex align="center" {...rest}>
      <Box
        borderRadius="8px"
        boxSize="3rem"
        boxShadow="inner"
        mr="6px"
        bgColor={colorCode}
        fontFamily="Inter"
      />
      <Box fontSize="sm" fontFamily="Inter">
        <Box
          fontWeight="semibold"
          fontFamily="Inter"
          textTransform="capitalize"
        >
          {name}
        </Box>
        <Box textTransform="uppercase" fontFamily="Inter">
          {colorCode}
        </Box>
      </Box>
    </Flex>
  )
}

export const ColorPalettes = (props: { color: string }) => {
  const { color } = props

  const keys = Object.keys(theme.colors[color])

  return keys.map(item => (
    <ColorPalette
      key={`${color}.${item}`}
      color={`${color}.${item}`}
      name={`${color} ${item}`}
    />
  ))
}

export const ColorWrapper = (props: GridProps) => (
  <Grid
    mt="14px"
    gap="12px"
    templateColumns="repeat( auto-fit, minmax(200px, 1fr) )"
    {...props}
  />
)
