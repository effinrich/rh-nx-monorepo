import { useState } from 'react'
import {
  type InputProps,
  CloseIcon,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
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
  // Search will manage it's own value state separate from react-hook-form
  // This allows us to update the input immediately, while debouncing the actual
  // value behind the scenes. Debouncing allows us to reduce the amount of requests
  // we send to our Analytics server and API server.
  const [value, setValue] = useState(defaultValue || DEFAULT_VALUE)
  const debouncedOnChange = useDebounce(onChange, 500)
  return (
    <FormControl py={4}>
      <InputGroup>
        <InputLeftAddon>
          <SearchIcon color="gray.800" w="16px" h="16px" />
        </InputLeftAddon>
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
        <InputRightElement>
          <IconButton
            size="sm"
            variant="ghost"
            icon={<CloseIcon />}
            aria-label="clear search"
            onClick={() => {
              setValue(DEFAULT_VALUE)
              // no need to debounce clearing since it's a single action
              onChange(DEFAULT_VALUE)
            }}
            visibility={value ? 'visible' : 'hidden'}
          />
        </InputRightElement>
      </InputGroup>
    </FormControl>
  )
}

export default Search
