import { Link, useParams } from 'react-router-dom'
import { useTitle } from 'react-use'
import {
  AdvisorDetails,
  useAdvisorQuery
} from '@redesignhealth/third-party-network/features/advisors'
import { Box, Button } from '@redesignhealth/ui'

export const Advisor = () => {
  const { advisorId = '' } = useParams()
  const { data: advisor } = useAdvisorQuery(advisorId)
  useTitle('RH Advise' + (advisor?.name ? ` | ${advisor?.name}` : ''))

  return (
    <Box>
      <Box as="header">
        <Button
          as={Link}
          to="/"
          variant="link"
          colorScheme="blue"
          fontSize="xs"
        >
          Back to results
        </Button>
      </Box>

      <Box as="main" p={['24px', '32px']}>
        <AdvisorDetails advisorId={advisorId} />
      </Box>
    </Box>
  )
}
