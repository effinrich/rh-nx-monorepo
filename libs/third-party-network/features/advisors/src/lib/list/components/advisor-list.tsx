import { useCallback, useState } from 'react'
import { usePagination } from '@redesignhealth/hooks'
import { Box, Button, Flex, Grid, Loader } from '@redesignhealth/ui'

import { useAdvisors, useAllAdvisorsQuery } from '../hooks'
import { FilterName, Filters } from '../types'

import { AdvisorCard } from './advisor-card'
import { Filter } from './filter'
import { Search } from './search'

export const AdvisorList = () => {
  const { isPending } = useAllAdvisorsQuery()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    opcoEngagementNames: [],
    tags: []
  })
  const rawAdvisors = useAdvisors(search, filters)
  const {
    data: advisors,
    page,
    decrementPage,
    incrementPage,
    maxPage
  } = usePagination(rawAdvisors, 30)

  const handleChange = useCallback(
    (name: FilterName, newValues: Array<string>) =>
      setFilters({ ...filters, [name]: newValues }),
    [filters]
  )

  if (isPending) return <Loader mt="20px" />

  return (
    <Box>
      <Flex justify="space-between" align="flex-end" gap="20px">
        <Search onChange={setSearch} />
        <Flex gap="2">
          <Button onClick={decrementPage} isDisabled={page <= 0}>
            Previous
          </Button>
          <Button onClick={incrementPage} isDisabled={page >= maxPage}>
            Next
          </Button>
        </Flex>
      </Flex>
      <Grid templateColumns="repeat(3, 1fr)" gap="20px" mt="24px">
        {filterNames.map(({ badgeColor, label, name }) => (
          <Filter
            key={name}
            badgeColor={badgeColor}
            name={name}
            label={label}
            onChange={handleChange}
          />
        ))}
      </Grid>
      <Flex flexDir="column" gap="32px" mt="32px">
        {advisors?.map(advisor => (
          <AdvisorCard
            key={advisor.id}
            advisorId={advisor.id ?? ''}
            linkedIn={advisor.linkedIn}
            name={advisor.name}
            opcoEngagementNames={advisor.opcoEngagementNames}
            organization={advisor.organization}
            advisorRole={advisor.advisorRole}
            categories={advisor.categories}
            tags={advisor.tags}
            bio={advisor.bio}
          />
        ))}
      </Flex>
    </Box>
  )
}

const filterNames = [
  { name: 'categories', label: 'Category', badgeColor: 'blue' },
  { name: 'tags', label: 'Tag', badgeColor: 'green' },
  { name: 'opcoEngagementNames', label: 'OpCo Engagements', badgeColor: 'gray' }
] as const
