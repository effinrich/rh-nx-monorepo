import { HStack } from '../../h-stack/h-stack'

import { Logo } from '../logo'
import { RedesignHealthPrismIcon } from '../redesign-health-prism'

export function WithPrismIconLogo() {
  return (
    <HStack gap="6" align="center">
      <RedesignHealthPrismIcon boxSize="8" />
      <Logo height="8" />
    </HStack>
  )
}
