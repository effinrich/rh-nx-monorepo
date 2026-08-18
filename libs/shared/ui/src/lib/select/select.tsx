import { forwardRef } from 'react'
import {
  NativeSelectField,
  NativeSelectIndicator,
  NativeSelectRoot,
  type NativeSelectFieldProps,
  type NativeSelectRootProps,
  type SelectRootProps
} from '@chakra-ui/react'

export {
  NativeSelectRoot,
  NativeSelectField,
  NativeSelectIndicator
} from '@chakra-ui/react'

export {
  SelectRoot,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemGroupLabel,
  SelectLabel,
  SelectPositioner,
  SelectValueText,
  SelectIndicator,
  SelectIndicatorGroup,
  SelectClearTrigger,
  SelectControl,
  SelectHiddenSelect
} from '@chakra-ui/react'

export const NativeSelect = NativeSelectRoot

/**
 * Native HTML select with v2-compatible `<Select><option/></Select>` usage.
 * Custom listbox select is `SelectRoot` / `Select.*`.
 */
export const Select = forwardRef<HTMLSelectElement, NativeSelectFieldProps>(
  function Select(props, ref) {
    return (
      <NativeSelectRoot>
        <NativeSelectField ref={ref} {...props} />
        <NativeSelectIndicator />
      </NativeSelectRoot>
    )
  }
)

export type { NativeSelectRootProps, NativeSelectFieldProps, SelectRootProps }
