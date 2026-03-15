import { Box, Flex, FlexProps, Grid, GridProps, getColorShades, resolveColorToken } from '../index'

import '@fontsource-variable/inter'

type ColorPaletteProps = FlexProps & { color?: string; name?: string }

export const ColorPalette = (props: ColorPaletteProps) => {
  const { color, name, ...rest } = props
  const colorCode = resolveColorToken(color!)

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
  const keys = getColorShades(color)

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
