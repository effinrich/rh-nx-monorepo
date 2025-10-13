import Fuse from 'fuse.js'
import { Entries } from 'type-fest'

import { AdvisorList, Filters } from './types'

export const searchAdvisors = (rawAdvisors: AdvisorList, search: string) => {
  const fuse = new Fuse(rawAdvisors, {
    keys: Object.keys(rawAdvisors?.[0] ?? {}),
    threshold: 0.2,
    ignoreLocation: true
  })

  const advisors = fuse.search(search).map(({ item }) => item)
  return advisors.length === 0 ? null : advisors
}

export const filterAdvisors = (rawAdvisors: AdvisorList, filters: Filters) => {
  const filterEntries = Object.entries(filters) as Entries<typeof filters>
  const validFilters = filterEntries.filter(([, values]) => values.length > 0)
  const queries = validFilters.map(([name, values]) => ({
    $or: values.map(v => ({ [name]: v }))
  }))

  const fuse = new Fuse(rawAdvisors, {
    keys: Object.keys(filters),
    threshold: 0
  })

  const advisors = fuse.search({ $and: queries }).map(({ item }) => item)
  return advisors.length === 0 ? null : advisors
}
