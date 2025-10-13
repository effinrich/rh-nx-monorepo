import {
  CategoryGrouping,
  LibraryDoc,
  useLibraryStore
} from '@redesignhealth/portal/data-assets'
import { useQuery } from '@tanstack/react-query'

import { getAllContent } from './api'

export const useGetAllContent = (libraryId: string) => {
  const categoryFilter = useLibraryStore(state => state.categoryFilter)
  const searchQuery = useLibraryStore(state => state.searchQuery)
  const moduleTypeValue = useLibraryStore(state => state.moduleTypeValue)

  return useQuery({
    queryKey: [
      'library',
      libraryId,
      searchQuery,
      moduleTypeValue,
      moduleTypeValue?.value
    ],
    queryFn: () =>
      getAllContent(libraryId, searchQuery, moduleTypeValue?.value),
    select: data => transform(data, categoryFilter?.value)
  })
}

export const useGetCategories = (libraryId: string) => {
  return useQuery({
    queryKey: ['library', libraryId, undefined, 'CATEGORY'],
    queryFn: () => getAllContent(libraryId, undefined, 'CATEGORY')
  })
}

const transform = (content: LibraryDoc[], selectedCategoryId?: string) => {
  const categories: LibraryDoc[] = []

  for (const doc of content) {
    for (const ancestor of doc.ancestors || []) {
      switch (ancestor.type.value) {
        case 'CATEGORY':
          doc.categoryId = ancestor.id
          categories.push(ancestor)
          break
        case 'SOLUTION':
          doc.solutionId = ancestor.id
          break
      }
    }
  }

  let filteredContent = selectedCategoryId
    ? content.filter(doc => doc.categoryId === selectedCategoryId)
    : content

  // We do not support 'Category' cards atm
  filteredContent = filteredContent.filter(c => c.type.value !== 'CATEGORY')

  const groupedByCategory = filteredContent.reduce<CategoryGrouping[]>(
    (groups, document) => {
      const categoryGroup = groups.find(
        g => g.categoryId === document.categoryId
      )
      if (!categoryGroup) {
        const category = categories.find(c => c.id === document.categoryId)
        groups.push({
          categoryId: category?.id,
          categoryTitle: category?.title,
          documents: [document]
        })
      } else {
        categoryGroup.documents.push(document)
      }

      return groups
    },
    []
  )

  return groupedByCategory
}
