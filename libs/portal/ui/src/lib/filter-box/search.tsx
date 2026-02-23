import { useState } from 'react'
import {
  type InputProps,
  CloseIcon,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  SearchIcon
} from '@redesignhealth/ui'
import { useDebounce } from 'rooks'
interface SearchProps
  extends Omit<InputProps, 'onChange' | 'defaultValue' | 'value'> {
  defaultValue?: string
  onChange(newValue: string): void
  handleClear?(): void
}

const DEFAULT_VALUE = ''
export const Search = ({
  placeholder = 'Search',
  onChange,
  defaultValue,
  ...inputProps
}: SearchProps) => {
  const [value, setValue] = useState(defaultValue || DEFAULT_VALUE)
  const debouncedOnChange = useDebounce(onChange, 500)

  const clearButton = (
    <IconButton
      size="sm"
      variant="ghost"
      aria-label="clear search"
      onClick={() => {
        setValue(DEFAULT_VALUE)
        onChange(DEFAULT_VALUE)
      }}
      visibility={value ? 'visible' : 'hidden'}
    >
      <CloseIcon />
    </IconButton>
  )

  return (
    <FormControl py={4}>
      <InputGroup
        startElement={<SearchIcon color="gray.800" w="16px" h="16px" />}
        endElement={clearButton}
      >
        <Input
          size="md"
          placeholder={placeholder}
          onChange={e => {
            const newValue = e.target.value
            setValue(newValue)
            debouncedOnChange(newValue)
          }}
          value={value}
          {...inputProps}
        />
      </InputGroup>
    </FormControl>
  )
}

export default Search
