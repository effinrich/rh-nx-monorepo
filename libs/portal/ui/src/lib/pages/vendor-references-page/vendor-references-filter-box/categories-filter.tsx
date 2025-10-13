import { useCategoryStore } from '@redesignhealth/portal/data-assets'

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
  const categories = useCategoryStore(state => state.categories)
  const setCategoryFilter = useCategoryStore(state => state.setCategoryFilter)
  const categoryFilter = useCategoryStore(state => state.categoryFilter)
  return (
    <Filter
      placeholder="Categories"
      options={categories}
      value={categoryFilter}
      onChange={setCategoryFilter}
      getOptionLabel={option => option.name}
      getOptionValue={option => option.name}
    />
  )
}

export default CategoriesFilter
