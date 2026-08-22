import { BeatLoader } from 'react-spinners'

import { Button } from '../button'

export function WithCustomLoadingStateButton() {
  return (
    <Button
      loading
      colorPalette="blue"
      spinner={<BeatLoader size={8} color="white" />}
    >
      Click me
    </Button>
  )
}
