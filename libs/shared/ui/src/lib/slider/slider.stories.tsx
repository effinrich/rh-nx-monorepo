import * as React from 'react'

import { rh } from '../rh/rh'

import {
  Slider,
  SliderFilledTrack,
  SliderMark,
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
  const [disabled, setIsDisabled] = React.useState(true)
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
        Slide max value: {max}, disabled: {String(disabled)}
      </h1>
      <Slider
        aria-label="Player Progress"
        min={0}
        max={max}
        disabled={disabled}
        defaultValue={0}
        value={count}
        onChange={setCount}
        mr="20"
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>

      <button onClick={() => setCount(count => count + 1)}>
        count is {count}
      </button>
    </rh.div>
  )
}

export function HorizontalSlider() {
  return (
    <Slider colorPalette="red">
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
      <SliderMark value={90} top="20px">
        "90%"
      </SliderMark>
    </Slider>
  )
}

export function VerticalSlider() {
  return (
    <Slider colorPalette="red" isReversed orientation="vertical">
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
      <SliderMark value={90} children="90%" left="40px" />
    </Slider>
  )
}

export function rhHorizontalSlider() {
  return (
    <Slider colorPalette="blue" defaultValue={40}>
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb children="#" boxSize="30px" color="black" />
    </Slider>
  )
}

export function SteppedHorizontalSlider() {
  const [value, setValue] = React.useState<number>(1)
  return (
    <Slider value={value} onChange={setValue} min={1} max={7} step={2}>
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb children={value} boxSize="30px" color="black" />
    </Slider>
  )
}
