import { Stack } from '../../../index'
import { Textarea } from '../textarea'

export function WithFocusAndErrorColorsTextarea() {
  return (
    <Stack align="start" gap={10}>
      <Textarea
        css={{ '--focus-color': 'lime' }}
        placeholder="Here is a sample placeholder"
      />

      <Textarea
        css={{ '--focus-color': 'colors.pink.400' }}
        placeholder="Here is a sample placeholder"
      />

      <Textarea
        aria-invalid
        css={{ '--error-color': 'colors.red.300' }}
        placeholder="Here is a sample placeholder"
      />

      <Textarea
        aria-invalid
        css={{ '--error-color': 'crimson' }}
        placeholder="Here is a sample placeholder"
      />
    </Stack>
  )
}
