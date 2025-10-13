import { useNavigate } from 'react-router-dom'
import analytics from '@redesignhealth/analytics'
import {
  CompanyApiEnum,
  getSolutionById
} from '@redesignhealth/portal/data-assets'
import { ResultCard } from '@redesignhealth/portal/ui'
import { SimpleGrid } from '@redesignhealth/ui'

interface Doc {
  type: CompanyApiEnum
  title: string
  id: string
  category: string
  description: string
}

interface ResultsProps {
  docs: Doc[]
  libraryRoute: string
}
export const Results = ({ docs, libraryRoute }: ResultsProps) => {
  const navigate = useNavigate()

  const handleNavigateToModule = async (id: string) => {
    const data = await getSolutionById(id)

    analytics.sendSelectContentEvent({
      content_type: 'Solution',
      content_id: data.title
    })

    if (data) {
      const modId = data?.children?.[0]?.id
      if (modId) {
        navigate(`/${libraryRoute}/${id}/module/${modId}`)
      }
    }
  }

  if (!docs) return null
  return (
    <SimpleGrid columns={[1, 2, 2, 2, 2, 3]} spacing={5}>
      {docs.map(doc => {
        return (
          <ResultCard
            key={doc.id}
            title={doc.title}
            description={doc.description}
            onClick={() => handleNavigateToModule(doc.id)}
            contentType={doc.type.displayName}
            cursor="pointer"
          />
        )
      })}
    </SimpleGrid>
  )
}
