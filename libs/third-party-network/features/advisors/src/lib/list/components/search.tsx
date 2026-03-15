import { ChangeEvent, memo } from 'react'
import { MdClose, MdSearch } from 'react-icons/md'
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup
} from '@redesignhealth/ui'
import debounce from 'debounce-promise'

interface SearchProps {
  onChange: (newValue: string) => void
}

export const Search = memo(({ onChange }: SearchProps) => {
  const handleChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }, 300)

  return (
    <FormControl>
      <FormLabel
        fontSize="sm"
        color="gray.600"
        fontWeight="semibold"
        lineHeight="none"
        letterSpacing="tight"
      >
        Search
      </FormLabel>
      <form
        method="POST"
        onReset={() => onChange('')}
        onSubmit={e => e.preventDefault()}
      >
        <InputGroup
          startElement={<MdSearch color="gray.400" />}
          endElement={
            <button type="reset">
              <MdClose />
            </button>
          }
        >
          <Input onChange={handleChange} />
        </InputGroup>
      </form>
    </FormControl>
  )
})

Search.displayName = 'Search'
