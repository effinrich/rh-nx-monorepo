import { Box } from '@redesignhealth/ui'
import {
  Combobox,
  MultipleComboboxProps,
  SingleComboboxProps
} from 'forgekit-chakra-react-select'

type FilterSourceProps<Option> = {
  options?: readonly Option[]
}

type SingleFilterProps<Option> = Omit<SingleComboboxProps<Option>, 'source'> &
  FilterSourceProps<Option> & {
    isMulti?: false
  }

type MultipleFilterProps<Option> = Omit<
  MultipleComboboxProps<Option>,
  'source'
> &
  FilterSourceProps<Option> & {
    isMulti: true
  }

type FilterProps<Option> =
  | SingleFilterProps<Option>
  | MultipleFilterProps<Option>

export const Filter = <Option,>(props: FilterProps<Option>) => {
  if (props.isMulti) {
    const {
      isMulti: _isMulti,
      options = [],
      size = 'sm',
      ...comboboxProps
    } = props

    return (
      <Box width={['100%', '100%', 'initial']} data-testid={props.name}>
        <Combobox.Multiple
          {...comboboxProps}
          size={size}
          source={{ kind: 'local', items: options }}
        />
      </Box>
    )
  }

  const {
    isMulti: _isMulti,
    options = [],
    size = 'sm',
    ...comboboxProps
  } = props

  return (
    <Box width={['100%', '100%', 'initial']} data-testid={props.name}>
      <Combobox.Single
        {...comboboxProps}
        size={size}
        source={{ kind: 'local', items: options }}
      />
    </Box>
  )
}

export default Filter
