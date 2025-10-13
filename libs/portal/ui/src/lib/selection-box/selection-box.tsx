import { Box, BoxProps } from '@redesignhealth/ui'

import { SelectionBoxClear } from './selection-box-clear'
import { SelectionBoxFilter } from './selection-box-filter'
import { SelectionBoxFiltersContainer } from './selection-box-filters-container'
import { SelectionBoxSearch } from './selection-box-search'

type SelectionBoxProps = BoxProps

export const SelectionBox = (props: SelectionBoxProps) => {
  return <Box {...props} bg="gray.100" p={5} rounded="lg" />
}

SelectionBox.Clear = SelectionBoxClear
SelectionBox.Filter = SelectionBoxFilter
SelectionBox.FiltersContainer = SelectionBoxFiltersContainer
SelectionBox.Search = SelectionBoxSearch
