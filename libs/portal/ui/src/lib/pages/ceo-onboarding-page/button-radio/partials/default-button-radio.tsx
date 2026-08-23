import { useState } from 'react'
import { RadioGroupRoot, Stack } from '@redesignhealth/ui'

import ButtonRadio from '../button-radio'

export function DefaultButtonRadio() {
  const [selected, setSelected] = useState<string>()
  return (
    <RadioGroupRoot
      value={selected}
      onValueChange={({ value }) => setSelected(value ?? undefined)}
    >
      <Stack gap={4}>
        <ButtonRadio
          title="Title 1"
          subtitle="Subtitle for option 1"
          value="Option 1"
          checked={selected === 'Option 1'}
        />
        <ButtonRadio
          title="Title 2"
          subtitle="Subtitle for option 2"
          value="Option 2"
          checked={selected === 'Option 2'}
        />
      </Stack>
    </RadioGroupRoot>
  )
}
