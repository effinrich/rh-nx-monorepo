import {
  AsyncLoadContext,
  Combobox,
  ComboboxSource,
  MultipleComboboxProps,
  SingleComboboxProps
} from 'forgekit-chakra-react-select'

type AutoCompleteSourceProps<Option> = {
  isAsync?: boolean
  options?: readonly Option[]
}

export type SingleAutoCompleteProps<Option> = Omit<
  SingleComboboxProps<Option>,
  'source'
> &
  AutoCompleteSourceProps<Option> & {
    isMulti?: false
  }

export type MultipleAutoCompleteProps<Option> = Omit<
  MultipleComboboxProps<Option>,
  'source'
> &
  AutoCompleteSourceProps<Option> & {
    isMulti: true
  }

export type AutoCompleteProps<Option> =
  | SingleAutoCompleteProps<Option>
  | MultipleAutoCompleteProps<Option>

function defaultOptionLabel<Option>(option: Option) {
  if (typeof option === 'string' || typeof option === 'number') {
    return String(option)
  }

  if (option && typeof option === 'object' && 'label' in option) {
    return String((option as { label: unknown }).label)
  }

  return String(option)
}

export function AutoComplete<Option>(props: AutoCompleteProps<Option>) {
  const { options = [], isAsync = true } = props
  const getOptionLabel = props.getOptionLabel ?? defaultOptionLabel<Option>

  const source: ComboboxSource<Option> = isAsync
    ? {
        kind: 'async',
        initialItems: options,
        debounceMs: 0,
        load: (query: string, { signal }: AsyncLoadContext) =>
          new Promise<readonly Option[]>(resolve => {
            const timeout = setTimeout(() => {
              const normalizedQuery = query.toLocaleLowerCase()
              resolve(
                options.filter(option =>
                  getOptionLabel(option)
                    .toLocaleLowerCase()
                    .includes(normalizedQuery)
                )
              )
            }, 1000)

            signal.addEventListener(
              'abort',
              () => {
                clearTimeout(timeout)
                resolve([])
              },
              { once: true }
            )
          })
      }
    : { kind: 'local', items: options }

  if (props.isMulti) {
    const {
      isAsync: _isAsync,
      isMulti: _isMulti,
      options: _options,
      ...comboboxProps
    } = props

    return (
      <Combobox.Multiple
        {...comboboxProps}
        colorPalette={props.colorPalette ?? 'primary'}
        source={source}
      />
    )
  }

  const {
    isAsync: _isAsync,
    isMulti: _isMulti,
    options: _options,
    ...comboboxProps
  } = props

  return (
    <Combobox.Single
      {...comboboxProps}
      colorPalette={props.colorPalette ?? 'primary'}
      source={source}
    />
  )
}

export default AutoComplete
