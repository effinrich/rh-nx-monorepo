import { MultipleCombobox } from './lib/multiple-combobox'
import { SingleCombobox } from './lib/single-combobox'

export const Combobox = {
  Multiple: MultipleCombobox,
  Single: SingleCombobox
}

export { MultipleCombobox, SingleCombobox }
export type {
  AsyncCacheOptions,
  AsyncLoadContext,
  AsyncSource,
  ComboboxSource,
  CommonComboboxProps,
  CreatableOptions,
  DefaultOption,
  LocalSource,
  MultipleComboboxProps,
  RenderOptionState,
  SingleComboboxProps
} from './lib/types'
