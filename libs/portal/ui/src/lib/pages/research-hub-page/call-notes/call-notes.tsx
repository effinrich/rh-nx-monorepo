import { Fragment, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import {
  CallNoteFilterName,
  CallNoteFilterOptions,
  CallNoteFilterSelectedOptions,
  CallNoteWithId,
  useResearchStore
} from '@redesignhealth/portal/data-assets'
import {
  useGetAllNotes,
  useGetExpertFilterOptions
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

import { CallNoteCard } from './call-note-card'

export interface CallNotesProps {
  notes?: { content: CallNoteWithId[]; totalResults: number }
  filterOptions?: CallNoteFilterOptions
  isPending: boolean
}

const CallNotes = () => {
  const [isConflicts, setIsConflicts] = useState(false)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const setNotesSearchQuery = useResearchStore(
    state => state.setNotesSearchQuery
  )
  const setNotesFilterSelections = useResearchStore(
    state => state.setNotesFilterSelections
  )

  const [filters, setFilters] = useState<CallNoteFilterSelectedOptions>({
    groupName: [],
    noteAuthor: [],
    stakeholders: [],
    tags: [],
    taxonomies: []
  })

  const searchBoxOnChange: InputProps = {
    onChange: event => setNotesSearchQuery(event.target.value)
  }

  const handleChange = (key: CallNoteFilterName, newValues: Array<string>) => {
    setFilters({ ...filters, [key]: newValues })
  }

  useEffect(() => {
    setNotesFilterSelections(filters)
  }, [filters, setNotesFilterSelections])

  const searchNotesQuery = useResearchStore(state => state.searchNotesQuery)
  const notesFilterSelections = useResearchStore(
    state => state.notesFilterSelections
  )

  const { data: filterOptions } = useGetExpertFilterOptions()

  const {
    data: callNotes,
    fetchNextPage: fetchNextNotes,
    hasNextPage: hasNextNotes,
    isPending: isLoadingNotes
  } = useGetAllNotes(searchNotesQuery, notesFilterSelections, 50)

  const allNotes = {
    content:
      callNotes?.pages.reduce((all, page) => {
        return [...all, ...page.content]
      }, [] as CallNoteWithId[]) || [],
    totalResults: callNotes?.pages[0]?.page.totalElements ?? 0
  }

  return (
    <Fragment>
      <SelectionBox>
        <SelectionBox.Search inputProps={searchBoxOnChange} />
        <SelectionBox.FiltersContainer>
          <Flex direction={['column', 'column', 'row', 'row']}>
            <SelectionBox.Filter
              pr={[0, 0, 2, 2]}
              aria-label="Entities"
              placeholder="Entities: All"
              options={filterOptions?.groupName}
              onChange={newValues => handleChange('groupName', newValues)}
              testid="Entity"
            />
            <SelectionBox.Filter
              pr={[0, 0, 2, 2]}
              aria-label="Stakeholders"
              placeholder="Stakeholders: All"
              options={filterOptions?.stakeholders}
              onChange={newValues => handleChange('stakeholders', newValues)}
              testid="Stakeholders"
            />
            <SelectionBox.Filter
              pr={[0, 0, 2, 2]}
              aria-label="Authors"
              placeholder="Authors: All"
              options={filterOptions?.noteAuthor}
              onChange={newValues => handleChange('noteAuthor', newValues)}
              testid="Authors"
            />
          </Flex>
          <Flex direction={['column', 'column', 'row', 'row']}>
            <SelectionBox.Filter
              pr={[0, 0, 2, 2]}
              aria-label="Tags"
              placeholder="Tags: All"
              options={filterOptions?.tags}
              onChange={newValues => handleChange('tags', newValues)}
              testid="Tags"
            />
            <SelectionBox.Filter
              pr={[0, 0, 2, 2]}
              aria-label="Taxonomy"
              placeholder="Taxonomy: All"
              options={filterOptions?.taxonomies}
              onChange={newValues => handleChange('taxonomies', newValues)}
              testid="Taxonomy"
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
            Results: {allNotes?.totalResults}
          </Text>
          <FormControl as={Flex} flexDir="row-reverse" align="center" mt="8px">
            <FormLabel m="0">Hide conflicted content</FormLabel>
            <Checkbox
              isDisabled={true}
              mr="12px"
              checked={isConflicts}
              onChange={e => setIsConflicts(e.target.checked)}
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
              {sortOrder === 'desc' ? 'Most recent' : 'Oldest'}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setSortOrder('desc')}>
                Most recent
              </MenuItem>
              <MenuItem onClick={() => setSortOrder('asc')}>Oldest</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {isLoadingNotes ? (
        <Loader />
      ) : (
        <Flex flexDir="column" gap="16px" mt="32px">
          {allNotes?.totalResults === 0 ? (
            <NoSearchResults searchName="call notes" />
          ) : (
            <>
              {allNotes?.content.map(note => (
                <CallNoteCard key={note.id} {...note} />
              ))}
              <Button
                isDisabled={!hasNextNotes}
                onClick={() => {
                  if (fetchNextNotes) {
                    fetchNextNotes()
                  }
                }}
              >
                Load more
              </Button>
            </>
          )}
        </Flex>
      )}
      <Outlet />
    </Fragment>
  )
}

export default CallNotes
