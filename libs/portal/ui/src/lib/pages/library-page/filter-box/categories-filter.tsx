import { useEffect, useState } from 'react'
import {
  Option,
  useLibraryStore,
  VIEW_ALL_OPTION
} from '@redesignhealth/portal/data-assets'

import { Filter } from '../../../filter-box'

export interface ContentProps {
  id: string
  title: string
  description: string
  remoteContentId: string
  parentId: string
  content: string
  links: {
    rel: string
    href: string
  }[]
}

export const CategoriesFilter = () => {
  const categories = useLibraryStore(state => state.categories)
  const [options, setOptions] = useState<Option[]>([])
  const [categoryFilter, setCategoryFilter] = useLibraryStore(state => [
    state.categoryFilter,
    state.setCategoryFilter
  ])

  useEffect(() => {
    if (categories) {
      setOptions([
        VIEW_ALL_OPTION,
        ...categories.map(c => ({ label: c.title, value: c.id }))
      ])
    }
  }, [categories])

  return (
    <Filter
      placeholder="Categories"
      options={options}
      onChange={setCategoryFilter}
      value={categoryFilter}
    />
  )
}

export default CategoriesFilter
