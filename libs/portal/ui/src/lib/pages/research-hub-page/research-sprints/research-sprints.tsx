import { Fragment, useEffect, useState } from 'react'
import {
  ResearchSprintFilterName,
  ResearchSprintFilterSelectedOptions,
  ResearchSprintWithId,
  useGetAllResearch,
  useGetFilterOptions,
  useResearchStore
} from '@redesignhealth/portal/data-assets'
import {
  Box,
  Button,
  Checkbox,
  ChevronDownIcon,
  Flex,
  FormControl,
  FormLabel,
  InputProps,
  Loader,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text
} from '@redesignhealth/ui'

import NoSearchResults from '../../../no-search-results/no-search-results'
import { SelectionBox } from '../../../selection-box/selection-box'

import { ResearchSprintCard } from './research-sprint-card'

const ResearchSprints = () => {
  const searchQuery = useResearchStore(state => state.searchQuery)
  const filterSelections = useResearchStore(state => state.filterSelections)
  const { data: filterOptions } = useGetFilterOptions()

  const [isHideConflicts, setIsHideConflicts] = useState(false)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const setSearchQuery = useResearchStore(state => state.setSearchQuery)
  const setFilterSelections = useResearchStore(
    state => state.setFilterSelections
  )
  const searchBoxOnChange: InputProps = {
    onChange: event => setSearchQuery(event.target.value)
  }

  const {
    data: research,
    fetchNextPage: fetchNextResearch,
    hasNextPage: hasNextResearch,
    isPending: isLoadingSprints
  } = useGetAllResearch(searchQuery, filterSelections, 50)
  const sprints = {
    content:
      research?.pages.reduce((all, page) => {
        return [...all, ...page.content]
      }, [] as ResearchSprintWithId[]) || [],
    totalResults: research?.pages[0]?.page.totalElements ?? 0
  }
  const [filters, setFilters] = useState<ResearchSprintFilterSelectedOptions>({
    groupName: [],
    method: [],
    segments: [],
    services: [],
    sprintAuthor: [],
    taxonomy: []
  })

  const handleChange = (
    key: ResearchSprintFilterName,
    newValues: Array<string>
  ) => {
    setFilters({ ...filters, [key]: newValues })
  }

  useEffect(() => {
    setFilterSelections(filters)
  }, [filters, setFilterSelections])

  return (
    <Fragment>
      <SelectionBox>
        <SelectionBox.Search inputProps={searchBoxOnChange} />

        <SelectionBox.FiltersContainer>
          {/* <SelectionBox.FiltersContainer clearButton={<SelectionBox.Clear />}></SelectionBox.FiltersContainer> */}
          <Flex direction={['column', 'column', 'row', 'row']}>
            <SelectionBox.Filter
              pr={[0, 0, 2, 2]}
              placeholder="Entity"
              options={filterOptions?.groupName}
              onChange={newValues => handleChange('groupName', newValues)}
            />
            <SelectionBox.Filter
              pr={[0, 0, 2, 2]}
              placeholder="Authors"
              options={filterOptions?.sprintAuthor}
              onChange={newValues => handleChange('sprintAuthor', newValues)}
            />
            <SelectionBox.Filter
              placeholder="Services"
              options={filterOptions?.services}
              onChange={newValues => handleChange('services', newValues)}
            />
          </Flex>
          <Flex direction={['column', 'column', 'row', 'row']}>
            <SelectionBox.Filter
              pr={[0, 0, 2, 2]}
              placeholder="Method"
              options={filterOptions?.method}
              onChange={newValues => handleChange('method', newValues)}
            />
            <SelectionBox.Filter
              pr={[0, 0, 2, 2]}
              placeholder="Segments"
              options={filterOptions?.segments}
              onChange={newValues => handleChange('segments', newValues)}
            />
            <SelectionBox.Filter
              placeholder="Taxonomy"
              options={filterOptions?.taxonomy}
              onChange={newValues => handleChange('taxonomy', newValues)}
            />
          </Flex>
        </SelectionBox.FiltersContainer>
      </SelectionBox>

      <Flex mt="40px" justify="space-between">
        <Box>
          <Text
            fontWeight="600"
            lineHeight="24px"
            fontSize="16px"
            color="gray.800"
          >
            Results: {sprints?.totalResults}
          </Text>
          <FormControl as={Flex} flexDir="row-reverse" align="center" mt="8px">
            <FormLabel m="0">Hide conflicted content</FormLabel>
            <Checkbox
              mr="12px"
              checked={isHideConflicts}
              isDisabled={true}
              onChange={e => setIsHideConflicts(e.target.checked)}
            />
          </FormControl>
        </Box>

        <Flex align="center" gap="16px" mt="-30px">
          <Text
            fontWeight="500"
            lineHeight="24px"
            fontSize="16px"
            color="gray.500"
          >
            Sort by
          </Text>

          <Menu>
            <MenuButton
              isDisabled={true}
              as={Button}
              rightIcon={<ChevronDownIcon />}
              colorScheme="gray"
              variant="outline"
            >
              {sortOrder === 'asc' ? 'Most recent' : 'Oldest'}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setSortOrder('asc')}>
                Most recent
              </MenuItem>
              <MenuItem onClick={() => setSortOrder('desc')}>Oldest</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {isLoadingSprints ? (
        <Loader />
      ) : (
        <Flex flexDir="column" gap="16px" mt="32px">
          {sprints?.content.length === 0 ? (
            <NoSearchResults searchName="research report" />
          ) : (
            <>
              {sprints?.content.map(sprint => (
                <ResearchSprintCard key={sprint.id} {...sprint} />
              ))}
              <Button
                isDisabled={!hasNextResearch}
                onClick={() => {
                  if (fetchNextResearch) {
                    fetchNextResearch()
                  }
                }}
              >
                Load more
              </Button>
            </>
          )}
        </Flex>
      )}
    </Fragment>
  )
}

export default ResearchSprints
