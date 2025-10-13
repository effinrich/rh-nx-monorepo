import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useLibraryStore } from '@redesignhealth/portal/data-assets'
import { LibraryPage, Page } from '@redesignhealth/portal/ui'

import { useGetAllContent, useGetCategories } from './hooks'

interface LibraryProps {
  libraryId: string
}

export const Library = ({ libraryId }: LibraryProps) => {
  const setCategories = useLibraryStore(state => state.setCategories)
  const resetState = useLibraryStore(state => state.reset)

  const { data: libraryDocuments } = useGetAllContent(libraryId)

  const { data: categoriesData } = useGetCategories(libraryId)

  useEffect(() => {
    resetState()
  }, [resetState])

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData)
    }
  }, [categoriesData, setCategories])

  return (
    <Page>
      <Helmet>
        <title>Library</title>
      </Helmet>
      <LibraryPage categoryGroupings={libraryDocuments} />
    </Page>
  )
}
