// Chakra UI v3: Slider uses compound component pattern
// onChange → onValueChange, onChangeEnd → onValueChangeEnd
// See: https://chakra-ui.com/docs/get-started/migration

// In Chakra v3, `Slider` is a namespace object (not a component).
// Export SliderRoot as Slider for backward compat.
export { SliderRoot as Slider } from '@chakra-ui/react'

// Export Slider compound components (v3 recommended pattern)
export {
  SliderRoot,
  SliderControl,
  SliderTrack,
  SliderRange,
  SliderThumb,
  SliderMarkerGroup,
  SliderMarker,
  SliderLabel,
  SliderValueText
} from '@chakra-ui/react'

// SliderMark was removed in Chakra v3 - use SliderMarker instead
export { SliderMarker as SliderMark } from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility
export { SliderRange as SliderFilledTrack } from '@chakra-ui/react'

// Export types
export type { SliderRootProps, SliderThumbProps } from '@chakra-ui/react'
