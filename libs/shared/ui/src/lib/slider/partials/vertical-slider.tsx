import {
  SliderControl,
  SliderMarker,
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack
} from '../slider'

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
