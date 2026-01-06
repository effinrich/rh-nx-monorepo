// Chakra UI v3: Slider uses compound component pattern
// onChange → onValueChange, onChangeEnd → onValueChangeEnd
// See: https://chakra-ui.com/docs/get-started/migration

export { Slider } from '@chakra-ui/react'

// Export Slider compound components (v3 recommended pattern)
export {
  SliderRoot,
  SliderControl,
  SliderTrack,
  SliderRange,
  SliderThumb,
  SliderMark,
  SliderMarkerGroup,
  SliderMarker,
  SliderLabel,
  SliderValueText
} from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility
export { SliderRange as SliderFilledTrack } from '@chakra-ui/react'

// Export types
export type { SliderRootProps, SliderThumbProps } from '@chakra-ui/react'
