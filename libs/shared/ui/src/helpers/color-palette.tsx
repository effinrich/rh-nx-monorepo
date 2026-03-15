import { Box, Flex, FlexProps, Grid, GridProps } from '../index'
import colors from '../lib/theme/foundations/colors'

import '@fontsource-variable/inter'

type ColorPaletteProps = FlexProps & { color?: string; name?: string }

// Access color values from the theme foundations (public API, avoids brittle internal _config access)
const resolvedColors = colors

export const ColorPalette = (props: ColorPaletteProps) => {
  const { color, name, ...rest } = props

  let colorCode = color
  const [shade, hue] = color!.split('.')

  const shadeValue = resolvedColors[shade]
  if (shade && hue && typeof shadeValue === 'object' && shadeValue !== null && hue in shadeValue) {
    colorCode = (shadeValue as Record<string, string>)[hue] ?? colorCode
  } else if (color! in resolvedColors && typeof resolvedColors[color!] === 'string') {
    colorCode = resolvedColors[color!] as string
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

  const colorValue = resolvedColors[color]
  const keys = typeof colorValue === 'object' && colorValue !== null
    ? Object.keys(colorValue)
    : []

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
