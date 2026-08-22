import { VStack } from '../../v-stack/v-stack'

import { Logo } from '../logo'

export function CustomSizeLogo() {
  return (
    <VStack gap="6" align="start">
      <Logo height="4" />
      <Logo height="6" />
      <Logo height="8" />
      <Logo height="12" />
      <Logo height="16" />
    </VStack>
  )
}
