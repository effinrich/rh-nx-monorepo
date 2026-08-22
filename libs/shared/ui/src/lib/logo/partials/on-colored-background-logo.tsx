import { Box } from '../../box/box'
import { HStack } from '../../h-stack/h-stack'

import { Logo } from '../logo'

export function OnColoredBackgroundLogo() {
  return (
    <HStack gap="4">
      <Box bg="primary.500" p="8" rounded="md">
        <Logo color="white" height="10" />
      </Box>
      <Box bg="secondary.500" p="8" rounded="md">
        <Logo color="white" height="10" />
      </Box>
      <Box bg="gray.100" p="8" rounded="md">
        <Logo color="gray.800" height="10" />
      </Box>
    </HStack>
  )
}
