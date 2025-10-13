import { HighlightedText } from '@redesignhealth/portal/data-assets'

import { ListCardRow } from '../list-card/list-card-row'
import { SearchMatches } from '../search-matches/search-matches'

interface SelectedExcerptsRowProps {
  highlightedText?: HighlightedText
  featuredField: string
}

const SelectedExcerptsRow = ({
  highlightedText,
  featuredField
}: SelectedExcerptsRowProps) => {
  // hide row if highlighted text not provided
  if (!highlightedText || Object.keys(highlightedText).length === 0) {
    return null
  }

  return (
    <ListCardRow title="Selected excerpts">
      <SearchMatches
        highlightedText={highlightedText}
        featuredField={featuredField}
      />
    </ListCardRow>
  )
}

export default SelectedExcerptsRow
