import { useState } from 'react'
import { RadioGroupRoot, Stack } from '@redesignhealth/ui'
import { withRouter } from 'storybook-addon-react-router-v6'

import type { Meta } from '@storybook/react-vite'

import ButtonRadio from './button-radio'

const Story: Meta<typeof ButtonRadio> = {
  component: ButtonRadio,
  title: 'Components / Button Radio',
  decorators: [withRouter],
  args: {}
}

export default Story

export const Default = () => {
  const [selected, setSelected] = useState<string>()
  return (
    <RadioGroupRoot value={selected} onChange={setSelected}>
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
