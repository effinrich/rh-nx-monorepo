import { MdSearch } from 'react-icons/md'
import { useResearchStore } from '@redesignhealth/portal/data-assets'
import {
  Input,
  InputGroup,
  InputGroupProps,
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
    <InputGroup {...props} startElement={<MdSearch height="16px" width="16px" />}>
      <Input
        placeholder="Search"
        aria-label="Search"
        name="search"
        onChange={event => setNotesSearchQuery(event.target.value)}
        ps="10"
        {...inputProps}
      />
    </InputGroup>
  )
}

SelectionBoxSearch.displayName = 'SelectionBoxSearch'
