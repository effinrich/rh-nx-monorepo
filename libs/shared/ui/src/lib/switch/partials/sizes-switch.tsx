import { HStack } from '../../../index'

import { Switch } from '../switch'

export function SizesSwitch() {
  return (
    <HStack>
      <Switch size="sm" />
      <Switch size="md" />
      <Switch size="lg" />
    </HStack>
  )
}
