import { Box } from '../../box/box'

import { Logo } from '../logo'

export function OnDarkBackgroundLogo() {
  return (
    <Box bg="gray.900" p="8" rounded="md">
      <Logo color="white" height="12" />
    </Box>
  )
}
