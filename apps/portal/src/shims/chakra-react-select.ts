/**
 * Compatibility shim for chakra-react-select → react-select.
 *
 * chakra-react-select v4/v5 imports Chakra UI v2 internal APIs that were
 * removed in v3 (useStyleConfig, useMultiStyleConfig, useFormControl, etc.).
 * This shim re-exports the identical public API from plain react-select so
 * no call-sites need to change. Chakra-specific props (colorScheme, etc.)
 * are simply ignored by react-select.
 */

// Core components
export { default as Select } from 'react-select'
export { default as AsyncSelect } from 'react-select/async'
export { default as CreatableSelect } from 'react-select/creatable'
export { default as AsyncCreatableSelect } from 'react-select/async-creatable'

// Re-export all types that consumers use
export type {
  GroupBase,
  Props,
  MultiValue,
  SingleValue,
  ActionMeta,
  OptionProps,
  SingleValueProps,
  MultiValueProps,
  InputActionMeta,
  SelectInstance,
  OnChangeValue,
  FormatOptionLabelMeta,
  StylesConfig,
  MenuListProps,
  PlaceholderProps,
  ControlProps,
  IndicatorsContainerProps,
  DropdownIndicatorProps,
  ClearIndicatorProps,
  MenuProps,
  NoticeProps,
} from 'react-select'

// OptionBase doesn't exist in react-select — it's a chakra-react-select
// convenience type. Declare it here as a simple open record.
export interface OptionBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
