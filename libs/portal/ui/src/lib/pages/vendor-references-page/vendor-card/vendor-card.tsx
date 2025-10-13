import { printPersonName } from '@redesignhealth/portal/utils'
import { BoxProps, HStack } from '@redesignhealth/ui'

import { ListCard } from '../../../list-card/list-card'
import { ListCardHeader } from '../../../list-card/list-card-header'
import { ListCardRow } from '../../../list-card/list-card-row'
import { ListCardRowsContainer } from '../../../list-card/list-card-rows-container'
import { ListCardTags } from '../../../list-card/list-card-tags'
import VendorContactInfo from '../../../vendor-contact-info/vendor-contact-info'

export interface VendorCardProps extends BoxProps {
  name: string
  type?: string
  categories: string[]
  tags: string[]
  contacts?: {
    givenName?: string
    familyName?: string
    email: string
  }[]
  rightAddon: React.ReactNode
}

export const VendorCard = ({
  name,
  type,
  categories,
  tags,
  contacts,
  rightAddon,
  ...props
}: VendorCardProps) => {
  return (
    <ListCard {...props}>
      <ListCardHeader title={name} subtitle={type}>
        {rightAddon}
      </ListCardHeader>
      <ListCardRowsContainer>
        <ListCardRow title="Categories">
          <ListCardTags values={categories} />
        </ListCardRow>
        <ListCardRow title="Tags">
          <ListCardTags values={tags} />
        </ListCardRow>
        <ListCardRow title="Who to talk to?">
          <HStack wrap="wrap" spacing={6}>
            {contacts?.map(contact => (
              <VendorContactInfo
                key={contact.email}
                name={printPersonName(contact)}
                email={contact.email}
              />
            ))}
          </HStack>
        </ListCardRow>
      </ListCardRowsContainer>
    </ListCard>
  )
}

export default VendorCard
