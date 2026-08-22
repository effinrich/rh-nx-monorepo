import {
  SliderControl,
  SliderMarker,
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack
} from '../slider'

export function HorizontalSlider() {
  return (
    <SliderRoot colorPalette="red">
      <SliderControl>
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb index={0} />
      </SliderControl>
      <SliderMarker value={90}>&quot;90%&quot;</SliderMarker>
    </SliderRoot>
  )
}
