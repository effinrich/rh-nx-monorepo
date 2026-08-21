import { type BoxProps, Box } from '../box/box'

export const Card = (props: BoxProps) => (
  <Box
    minH="3xs"
    bg="bg-surface"
    boxShadow={{ _light: 'sm', _dark: 'sm-dark' }}
    borderRadius="lg"
    {...props}
  />
)
