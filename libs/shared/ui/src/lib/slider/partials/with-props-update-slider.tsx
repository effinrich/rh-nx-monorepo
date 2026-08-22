import * as React from 'react'

import { rh } from '../../rh/rh'

import {
  SliderControl,
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack
} from '../slider'

const DEFAULT_MAX_VALUE = 40

export function WithPropsUpdateSlider() {
  const [count, setCount] = React.useState(0)
  const [isDisabled, setIsDisabled] = React.useState(true)
  const [max, setMax] = React.useState(DEFAULT_MAX_VALUE)

  React.useEffect(() => {
    const id = setTimeout(() => {
      setIsDisabled(false)
      setMax(150)
    }, 1000)

    return () => {
      clearTimeout(id)
    }
  }, [])

  return (
    <rh.div display="flex" flexDirection="column" gap="8">
      <h1>
        Slide max value: {max}, isDisabled: {String(isDisabled)}
      </h1>
      <SliderRoot
        aria-label="Player Progress"
        min={0}
        max={max}
        disabled={isDisabled}
        defaultValue={[0]}
        value={[count]}
        onValueChange={({ value }) => setCount(value[0])}
        mr="20"
      >
        <SliderControl>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>
          <SliderThumb index={0} />
        </SliderControl>
      </SliderRoot>

      <button onClick={() => setCount(c => c + 1)}>count is {count}</button>
    </rh.div>
  )
}
