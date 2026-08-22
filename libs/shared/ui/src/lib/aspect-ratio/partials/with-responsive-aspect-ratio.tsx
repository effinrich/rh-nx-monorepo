import { Box } from '../../box/box'

import { AspectRatio } from '../aspect-ratio'

export function WithResponsiveAspectRatio() {
  return (
    <AspectRatio
      maxWidth="300px"
      ratio={{ base: 1, sm: 4 / 3, md: 16 / 9, lg: 21 / 9 }}
    >
      <Box
        backgroundColor={{
          base: 'red.500',
          sm: 'red.400',
          md: 'red.300',
          lg: 'red.200'
        }}
      >
        Box
      </Box>
    </AspectRatio>
  )
}
