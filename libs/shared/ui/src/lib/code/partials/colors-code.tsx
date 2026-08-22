import { Stack } from '../../../index'

import { Code } from '../code'

export function ColorsCode() {
  return (
    <Stack direction="row">
      <Code children="console.log(welcome)" />
      <Code colorPalette="red" children="var chakra = 'awesome!'" />
      <Code colorPalette="yellow" children="npm install chakra" />
    </Stack>
  )
}
