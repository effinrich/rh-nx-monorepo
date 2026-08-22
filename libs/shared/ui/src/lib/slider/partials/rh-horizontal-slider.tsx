import {
  SliderControl,
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack
} from '../slider'

export function RhHorizontalSlider() {
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
