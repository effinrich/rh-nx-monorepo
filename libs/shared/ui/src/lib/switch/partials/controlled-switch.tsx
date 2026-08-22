import { useState } from 'react'

import { Switch } from '../switch'

export function ControlledSwitch() {
  const [checked, setChecked] = useState(true)

  return (
    <>
      {checked ? 'Checked' : 'Unchecked'}{' '}
      <Switch
        checked={checked}
        colorPalette="green"
        onCheckedChange={e => setChecked(e.checked === true)}
      />
    </>
  )
}
