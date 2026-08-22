import * as React from 'react'

import {
  SliderControl,
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack
} from '../slider'

export function SteppedHorizontalSlider() {
  const [value, setValue] = React.useState<number>(1)
  return (
    <SliderRoot
      value={[value]}
      onValueChange={({ value: v }) => setValue(v[0])}
      min={1}
      max={7}
      step={2}
    >
      <SliderControl>
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb index={0} boxSize="30px" color="black">
          {value}
        </SliderThumb>
      </SliderControl>
    </SliderRoot>
  )
}
