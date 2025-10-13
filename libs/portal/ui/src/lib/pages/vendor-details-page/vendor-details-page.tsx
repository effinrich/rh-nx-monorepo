import { MdEdit } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import { Vendor } from '@redesignhealth/portal/data-assets'
import { formatDate, printPersonName } from '@redesignhealth/portal/utils'
import { HStack, Icon, IconButton } from '@redesignhealth/ui'

import DetailsCard from '../../details-card/details-card'
import DetailsCardBody from '../../details-card/details-card-body'
import DetailsCardHeader from '../../details-card/details-card-header'
import DetailsCardRow from '../../details-card/details-card-row'
import { ListCardTags } from '../../list-card/list-card-tags'
import VendorContactInfo from '../../vendor-contact-info/vendor-contact-info'

interface VendorDetailsPageProps {
  canEdit?: boolean
  data: Vendor
}

const VendorDetailsPage = ({
  data: {
    name,
    vendorType,
    categories,
    subcategories,
    contacts,
    vendorPointContact,
    description,
    pricing,
    discountInfo,
    feedbackFromOpCos,
    pros,
    cons,
    features,
    created,
    hasPlatformAgreement
  },
  canEdit = false
}: VendorDetailsPageProps) => {
  return (
    <DetailsCard>
      <DetailsCardHeader
        title={name}
        backButtonText="Back to vendor references"
        subtitle={vendorType?.displayName}
        rightAddon={
          canEdit && (
            <IconButton
              as={RouterLink}
              to="edit"
              variant="outline"
              aria-label="Edit vendor"
              icon={<Icon as={MdEdit} />}
            />
          )
        }
      />
      <DetailsCardBody>
        <DetailsCardRow title="Category">
          <ListCardTags values={categories?.map(category => category.name)} />
        </DetailsCardRow>
        <DetailsCardRow title="Subcategory">
          <ListCardTags
            values={subcategories.map(subcategory => subcategory.name)}
          />
        </DetailsCardRow>
        <DetailsCardRow title="Who to contact">
          <HStack wrap="wrap" spacing={6} flex={1}>
            {contacts?.map(contact => (
              <VendorContactInfo
                key={contact.email}
                name={printPersonName(contact)}
                email={contact.email}
              />
            ))}
          </HStack>
        </DetailsCardRow>
        <DetailsCardRow title="Vendor point of contact">
          {vendorPointContact}
        </DetailsCardRow>
        <DetailsCardRow title="Description">{description}</DetailsCardRow>
        <DetailsCardRow title="Pricing">{pricing}</DetailsCardRow>
        <DetailsCardRow title="Discount info">{discountInfo}</DetailsCardRow>
        <DetailsCardRow title="Feedback from companies">
          {feedbackFromOpCos}
        </DetailsCardRow>
        <DetailsCardRow title="Pros">{pros}</DetailsCardRow>
        <DetailsCardRow title="Cons">{cons}</DetailsCardRow>
        <DetailsCardRow title="Features">{features}</DetailsCardRow>
        <DetailsCardRow title="Created on">
          {formatDate(created)}
        </DetailsCardRow>
        <DetailsCardRow title="Vendor signed platform agreement?">
          {hasPlatformAgreement ? 'Yes' : 'No'}
        </DetailsCardRow>
      </DetailsCardBody>
    </DetailsCard>
  )
}

export default VendorDetailsPage
