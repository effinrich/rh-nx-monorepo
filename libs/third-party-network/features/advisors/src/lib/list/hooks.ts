import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { getAllAdvisors } from './api'
import { AdvisorList, Filters } from './types'
import { filterAdvisors, searchAdvisors } from './utils'

export const useAllAdvisorsQuery = () => {
  return useQuery({
    queryKey: ['advisors'],
    queryFn: getAllAdvisors
  })
}

export const useAdvisors = (search: string, filters: Filters) => {
  const { data = [] } = useAllAdvisorsQuery()

  const selectionsExist =
    Object.values(filters).some(filter => filter.length > 0) || Boolean(search)

  const rawAdvisors = useMemo(
    () => data.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '')),
    [data]
  )

  const searchedAdvisors = useMemo(
    () => searchAdvisors(rawAdvisors, search),
    [rawAdvisors, search]
  )

  const filteredAdvisors = useMemo(
    () => filterAdvisors(rawAdvisors, filters),
    [filters, rawAdvisors]
  )

  if (!selectionsExist) return rawAdvisors
  if (!filteredAdvisors && !searchedAdvisors) return []
  if (!filteredAdvisors || !searchedAdvisors)
    return (searchedAdvisors ?? filteredAdvisors) as AdvisorList

  const advisors = searchedAdvisors?.filter(advisor =>
    filteredAdvisors?.some(a => a.id === advisor.id)
  )

  return advisors
}
