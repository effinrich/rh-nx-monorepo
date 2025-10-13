import { Link } from 'react-router-dom'
import { Button, Text } from '@redesignhealth/ui'

import { ListCard } from '../../../list-card/list-card'
import { ListCardHeader } from '../../../list-card/list-card-header'
import { ListCardRow } from '../../../list-card/list-card-row'
import { ListCardRowsContainer } from '../../../list-card/list-card-rows-container'
import Metrics from '../partials/metrics'

export interface IPCardProps {
  id: string
  name?: string
  organizationType?: string
  region?: string
  specialities?: string[]
  disease?: string
  organOfFocus?: string[]
  technologyTypes?: string[]
  executiveSummary?: string
  viewCount?: number
  requestCount?: number
  rightElement?: React.ReactNode
  sellerAddOn?: React.ReactNode
  buyerAddOn?: React.ReactNode
  detailsOfRequestAddOn?: React.ReactNode
  detailsOfRequestRightElement?: React.ReactNode
}

export const IPCard = ({
  id,
  name,
  organizationType,
  region,
  specialities,
  disease,
  organOfFocus,
  technologyTypes,
  executiveSummary,
  viewCount,
  requestCount,
  rightElement,
  sellerAddOn,
  buyerAddOn,
  detailsOfRequestAddOn,
  detailsOfRequestRightElement
}: IPCardProps) => {
  return (
    <ListCard>
      {name && (
        <ListCardHeader
          title={name}
          subtitle={
            <Metrics viewCount={viewCount} requestCount={requestCount} />
          }
        >
          {rightElement || (
            <Button
              as={Link}
              to={`/ip-marketplace/${id}`}
              colorScheme="primary"
              variant="solid"
              width={['100%', '100%', 'initial']}
            >
              View details
            </Button>
          )}
        </ListCardHeader>
      )}
      <ListCardRowsContainer>
        {detailsOfRequestAddOn && (
          <ListCardRow
            title="Details of request"
            rightElement={detailsOfRequestRightElement}
          >
            {detailsOfRequestAddOn}
          </ListCardRow>
        )}
        {sellerAddOn && <ListCardRow title="Seller">{sellerAddOn}</ListCardRow>}
        {buyerAddOn && <ListCardRow title="Buyer">{buyerAddOn}</ListCardRow>}
        {organizationType && (
          <ListCardRow title="Organization type">
            {organizationType}
          </ListCardRow>
        )}
        {region && <ListCardRow title="Region">{region}</ListCardRow>}
        {specialities && (
          <ListCardRow title="Specialities">
            {specialities?.join(', ')}
          </ListCardRow>
        )}
        {disease && <ListCardRow title="Disease">{disease}</ListCardRow>}
        {organOfFocus && (
          <ListCardRow title="Organ of focus">
            {organOfFocus?.join(', ')}
          </ListCardRow>
        )}
        {technologyTypes && (
          <ListCardRow title="Technology types">
            {technologyTypes?.join(', ')}
          </ListCardRow>
        )}
        {executiveSummary && (
          <ListCardRow title="Executive summary">
            <Text noOfLines={3}>{executiveSummary}</Text>
          </ListCardRow>
        )}
      </ListCardRowsContainer>
    </ListCard>
  )
}

export default IPCard
