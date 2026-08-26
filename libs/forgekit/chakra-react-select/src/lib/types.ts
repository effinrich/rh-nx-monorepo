import type { ReactNode } from 'react'
import type { ComboboxRootProps } from '@chakra-ui/react'

export interface DefaultOption {
  label: string
  value: string
}

export interface LocalSource<Option> {
  kind: 'local'
  items: readonly Option[]
  filter?: (option: Option, query: string) => boolean
}

export interface AsyncLoadContext {
  signal: AbortSignal
}

export interface AsyncCacheOptions {
  maxEntries?: number
  ttlMs?: number
}

export interface AsyncSource<Option> {
  kind: 'async'
  load: (
    query: string,
    context: AsyncLoadContext
  ) => Promise<readonly Option[]>
  initialItems?: readonly Option[]
  debounceMs?: number
  minQueryLength?: number
  cache?: boolean | AsyncCacheOptions
  onError?: (error: unknown, query: string) => void
}

export type ComboboxSource<Option> = LocalSource<Option> | AsyncSource<Option>

export interface CreatableOptions<Option> {
  createOption: (inputValue: string) => Option
  formatCreateLabel?: (inputValue: string) => ReactNode
  isValidInput?: (
    inputValue: string,
    items: readonly Option[]
  ) => boolean
}

export interface RenderOptionState {
  isCreateOption: boolean
}

export interface CommonComboboxProps<Option> {
  source: ComboboxSource<Option>
  getOptionLabel?: (option: Option) => string
  getOptionValue?: (option: Option) => string
  isOptionDisabled?: (option: Option) => boolean
  creatable?: CreatableOptions<Option>
  renderOption?: (option: Option, state: RenderOptionState) => ReactNode
  placeholder?: string
  noOptionsMessage?: (query: string) => ReactNode
  loadingMessage?: ReactNode
  errorMessage?: (error: unknown) => ReactNode
  id?: string
  name?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  disabled?: boolean
  invalid?: boolean
  required?: boolean
  readOnly?: boolean
  clearable?: boolean
  loading?: boolean
  closeOnSelect?: boolean
  openOnClick?: boolean
  onBlur?: () => void
  withinPortal?: boolean
  size?: ComboboxRootProps<Option>['size']
  variant?: ComboboxRootProps<Option>['variant']
  colorPalette?: ComboboxRootProps<Option>['colorPalette']
  positioning?: ComboboxRootProps<Option>['positioning']
}

export interface SingleComboboxProps<Option>
  extends CommonComboboxProps<Option> {
  value?: Option | null
  defaultValue?: Option | null
  onChange?: (option: Option | null) => void
}

export interface MultipleComboboxProps<Option>
  extends CommonComboboxProps<Option> {
  value?: readonly Option[]
  defaultValue?: readonly Option[]
  onChange?: (options: Option[]) => void
}
