import { Box } from '../../box/box'

import { Spinner } from '../spinner'

export function SizeSpinner() {
  return (
    <Box>
      {['xl', 'lg', 'md', 'sm', 'xs'].map(size => (
        <Spinner key={size} margin={3} color="green.500" size={size} />
      ))}
    </Box>
  )
}
