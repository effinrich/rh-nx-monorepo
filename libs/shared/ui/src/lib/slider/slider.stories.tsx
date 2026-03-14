import * as React from 'react'

import { rh } from '../rh/rh'

import {
  SliderRoot,
  SliderControl,
  SliderRange,
  SliderMarker,
  SliderThumb,
  SliderTrack
} from './slider'

export default {
  title: 'Components / Forms / Slider',
  decorators: [
    (story: () => React.ReactNode) => (
      <rh.div maxWidth="400px" height="300px" mx="auto" mt="40px">
        {story()}
      </rh.div>
    )
  ]
}

const DEFAULT_MAX_VALUE = 40

export const WithPropsUpdate = () => {
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

      <button onClick={() => setCount(count => count + 1)}>
        count is {count}
      </button>
    </rh.div>
  )
}

export function HorizontalSlider() {
  return (
    <SliderRoot colorPalette="red">
      <SliderControl>
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb index={0} />
      </SliderControl>
      <SliderMarker value={90}>
        "90%"
      </SliderMarker>
    </SliderRoot>
  )
}

export function VerticalSlider() {
  return (
    <SliderRoot colorPalette="red" orientation="vertical">
      <SliderControl>
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb index={0} />
      </SliderControl>
      <SliderMarker value={90}>90%</SliderMarker>
    </SliderRoot>
  )
}

export function rhHorizontalSlider() {
  return (
    <SliderRoot colorPalette="blue" defaultValue={[40]}>
      <SliderControl>
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb index={0} boxSize="30px" color="black">
          #
        </SliderThumb>
      </SliderControl>
    </SliderRoot>
  )
}

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
