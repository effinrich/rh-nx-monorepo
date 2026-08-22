import { VStack } from '../../v-stack/v-stack'

import { Logo } from '../logo'

export function CustomColorLogo() {
  return (
    <VStack gap="6" align="start">
      <Logo color="primary.500" />
      <Logo color="secondary.500" />
      <Logo color="gray.700" />
      <Logo color="blue.500" />
    </VStack>
  )
}
