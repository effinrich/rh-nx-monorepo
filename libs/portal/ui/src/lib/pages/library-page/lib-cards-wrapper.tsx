import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import analytics from '@redesignhealth/analytics'
import {
  type LibraryDoc,
  CategoryGrouping,
  getSolutionById
} from '@redesignhealth/portal/data-assets'
import { Box, Heading, SimpleGrid } from '@redesignhealth/ui'

import { NoSearchResults } from '../../no-search-results/no-search-results'

import { LibCard } from './lib-card/lib-card'

interface LibCardsWrapperProps {
  categoryGroupings: CategoryGrouping[]
}

export const LibCardsWrapper = ({
  categoryGroupings
}: LibCardsWrapperProps) => {
  const navigate = useNavigate()

  const handleGetSolutionById = async (id: string) => {
    const solution = await getSolutionById(id)
    const moduleId = solution?.children?.[0].id

    navigate(`/library/${id}/module/${moduleId}`)
  }

  const handleNavigateToModule = (doc: LibraryDoc) => {
    analytics.sendSelectContentEvent({
      content_type: doc.type.displayName,
      content_id: doc.title
    })

    if (doc.type.value === 'SOLUTION') {
      return handleGetSolutionById(doc.id)
    }

    const solutionId = doc.parentId
    const moduleId = doc.id

    navigate(`/library/${solutionId}/module/${moduleId}`)
  }

  return (
    <Box>
      {categoryGroupings.length > 0 ? (
        categoryGroupings.map(newDoc => {
          return (
            newDoc.documents.length > 0 && (
              <Fragment key={newDoc.categoryId}>
                <Heading as="h3" size="xs" pb={3} pt={8}>
                  {newDoc.categoryTitle}
                </Heading>
                <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                  {newDoc.documents.map((child: LibraryDoc) => (
                    <LibCard
                      key={child.id}
                      title={child.title}
                      description={child.description}
                      onClick={() => handleNavigateToModule(child)}
                      contentType={child.type.displayName}
                    />
                  ))}
                </SimpleGrid>
              </Fragment>
            )
          )
        })
      ) : (
        <NoSearchResults searchName="resource" />
      )}
    </Box>
  )
}

export default LibCardsWrapper
