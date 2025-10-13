import { useEffect, useRef } from 'react'
import analytics from '@redesignhealth/analytics'
import { useLibraryStore } from '@redesignhealth/portal/data-assets'
import { Button } from '@redesignhealth/ui'

import { DisclaimerModal, DisclaimerText } from '../../../disclaimer'
import { FilterBox, Filters, Search } from '../../../filter-box'

import CategoriesFilter from './categories-filter'
import ContentTypeFilter from './content-type-filter'

interface RefObject {
  handleOnOpen: () => void
}

export const LibraryFilterBox = () => {
  const modalRef = useRef<RefObject>({
    handleOnOpen: () => {
      return undefined
    }
  })
  const setSearchQuery = useLibraryStore(state => state.setSearchQuery)
  // TODO: Replace all of this with react-hook-form
  // Look at ceo filter box for an example
  const searchQuery = useLibraryStore(state => state.searchQuery)
  const categoryFilter = useLibraryStore(state => state.categoryFilter)
  const moduleTypeValue = useLibraryStore(state => state.moduleTypeValue)
  useEffect(() => {
    analytics.sendSearchEvent({
      query: searchQuery,
      filters: [
        {
          field: 'categoryFilter',
          value: categoryFilter?.value
        },
        {
          field: 'moduleTypeFilter',
          value: moduleTypeValue?.value
        }
      ]
    })
  }, [searchQuery, categoryFilter, moduleTypeValue])

  return (
    <>
      <DisclaimerModal ref={modalRef} header="Disclaimer" buttonText="Got it">
        <DisclaimerText />
      </DisclaimerModal>
      <FilterBox
        title="Library"
        description={
          <>
            A collection of curated playbooks, templates, and tools to help you
            through critical stages of company creation.{' '}
            <Button
              color="gray.500"
              variant="link"
              fontWeight="normal"
              textDecoration="underline"
              onClick={() => modalRef?.current?.handleOnOpen()}
              _hover={{
                textDecoration: 'underline',
                color: 'primary.500'
              }}
            >
              See Disclaimer
            </Button>
          </>
        }
      >
        <Search
          defaultValue={searchQuery}
          onChange={value => {
            setSearchQuery(value)
          }}
          name="search"
        />
        <Filters>
          <CategoriesFilter />
          <ContentTypeFilter />
        </Filters>
      </FilterBox>
    </>
  )
}
