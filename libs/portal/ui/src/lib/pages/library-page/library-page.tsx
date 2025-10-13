import { useLocalStorage } from 'react-use'
import { CategoryGrouping } from '@redesignhealth/portal/data-assets'
import { Box, Loader, SectionHeader } from '@redesignhealth/ui'

import { DisclaimerBox, DisclaimerText } from '../../disclaimer'

import { LibraryFilterBox } from './filter-box/library-filter-box'
import LibCardsWrapper from './lib-cards-wrapper'

interface LibraryPageProps {
  categoryGroupings?: CategoryGrouping[]
}

export const LibraryPage = ({ categoryGroupings }: LibraryPageProps) => {
  const [isFirstVisit, setIsFirstVisit] = useLocalStorage(
    'library-first-visit',
    true
  )

  return (
    <Box as="section" w="full">
      <SectionHeader pb={6} title="Library" isDivider={false} />
      <DisclaimerBox
        isFirstVisit={isFirstVisit}
        onClickAlert={() => setIsFirstVisit(false)}
        title="Disclaimer"
      >
        <DisclaimerText />
      </DisclaimerBox>
      <LibraryFilterBox />
      {categoryGroupings ? (
        <LibCardsWrapper categoryGroupings={categoryGroupings} />
      ) : (
        <Loader />
      )}
    </Box>
  )
}

export default LibraryPage
