import { MdSearch } from 'react-icons/md'
import { useResearchStore } from '@redesignhealth/portal/data-assets'
import {
  Flex,
  Input,
  InputGroup,
  InputGroupProps,
  InputLeftElement,
  InputProps
} from '@redesignhealth/ui'

interface SelectionBoxSearchProps extends InputGroupProps {
  inputProps?: InputProps
}

export const SelectionBoxSearch = ({
  inputProps,
  ...props
}: SelectionBoxSearchProps) => {
  const setNotesSearchQuery = useResearchStore(
    state => state.setNotesSearchQuery
  )

  return (
    <InputGroup {...props}>
      <InputLeftElement
        as={Flex}
        pointerEvents="none"
        justify="center"
        align="center"
      >
        <MdSearch height="16px" width="16px" />
      </InputLeftElement>
      <Input
        placeholder="Search"
        aria-label="Search"
        name="search"
        onChange={event => setNotesSearchQuery(event.target.value)}
        {...inputProps}
      />
    </InputGroup>
  )
}

SelectionBoxSearch.displayName = 'SelectionBoxSearch'
