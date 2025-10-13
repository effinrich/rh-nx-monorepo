import { MdOpenInNew } from 'react-icons/md'
import { useParams } from 'react-router-dom'
import {
  CompanyApiEnum,
  useGetIpListing
} from '@redesignhealth/portal/data-assets'
import { formatDate, printPersonName } from '@redesignhealth/portal/utils'
import { Icon, Link, Loader } from '@redesignhealth/ui'

import DetailsCardBody from '../../../../details-card/details-card-body'
import DetailsCardRow from '../../../../details-card/details-card-row'
import SellerInfo from '../../partials/seller-info'

const convertBooleanToText = (value?: boolean) => (value ? 'Yes' : 'No')

const printList = (values?: CompanyApiEnum[]) =>
  values?.map(v => v.displayName).join(', ')

/**
 * Used to expand/hide information if a user chooses "Other"
 */
const OTHER_OPTION = 'OTHER'

const IpListingIpDetails = () => {
  const { ipListingId } = useParams()
  const { data } = useGetIpListing(ipListingId)
  const ipOwner = data?.owner || data?.requestContactInfo?.[0].sellerInfo
  return data ? (
    <DetailsCardBody>
      <DetailsCardRow title="Seller">
        <SellerInfo
          company={data.organization.name}
          name={ipOwner && printPersonName(ipOwner)}
          email={ipOwner?.email}
        />
      </DetailsCardRow>
      <DetailsCardRow title="Specialty">
        {printList(data.speciality)}
      </DetailsCardRow>
      <DetailsCardRow title="Organ of focus">
        {printList(data.organOfFocus)}
      </DetailsCardRow>
      <DetailsCardRow title="Technology types">
        {printList(data.technologyType)}
      </DetailsCardRow>
      <DetailsCardRow title="Disease">{data?.disease}</DetailsCardRow>
      <DetailsCardRow title="Executive summary">
        {data.executiveSummary}
      </DetailsCardRow>
      <DetailsCardRow title="Organization name">
        {data.organization?.name}
      </DetailsCardRow>
      <DetailsCardRow title="Seller summary/Tech transfer approach">
        {data.sellerSummaryTechTransferApproach}
      </DetailsCardRow>
      <DetailsCardRow title="Responsible inventor">
        {data.responsibleInventor}
      </DetailsCardRow>
      <DetailsCardRow title="Therapeutic need/Trends being addressed">
        {data.therapeuticNeedOrTrendsBeingAddressed}
      </DetailsCardRow>
      <DetailsCardRow title="Freedom to operate certification">
        {data.freedomToOperateCertification?.displayName}
      </DetailsCardRow>
      <DetailsCardRow title="Technology levels of maturity">
        {printList(data.technologyLevelOfMaturity)}
      </DetailsCardRow>
      <DetailsCardRow title="Technology overview">
        {data.technologyOverview}
      </DetailsCardRow>
      <DetailsCardRow title="Patent status">
        {data.patentStatus?.displayName}
      </DetailsCardRow>
      {data?.patentStatus?.value === OTHER_OPTION && (
        <DetailsCardRow title="Patent status (other)">
          {data.patentStatusOtherInfo}
        </DetailsCardRow>
      )}
      <DetailsCardRow title="Patent link">
        {data?.patentStatusHref}
      </DetailsCardRow>
      <DetailsCardRow title="Legal patentability assessment available">
        {convertBooleanToText(data.legalPatentabilityAssessmentAvailable)}
      </DetailsCardRow>
      <DetailsCardRow title="Copyrighted">
        {convertBooleanToText(data.copyrighted)}
      </DetailsCardRow>
      <DetailsCardRow title="License restrictions">
        {convertBooleanToText(data.licenseRestriction)}
      </DetailsCardRow>
      {data.licenseRestriction && (
        <DetailsCardRow title="About license restrictions">
          {data.aboutLicenseRestriction}
        </DetailsCardRow>
      )}
      <DetailsCardRow title="Patent geography validity">
        {printList(data.patentGeographicValidity)}
      </DetailsCardRow>
      {data?.patentGeographicValidity?.some(v => v.value === OTHER_OPTION) && (
        <DetailsCardRow title="Patent geography validity (other)">
          {data.patentGeographicValidityOther}
        </DetailsCardRow>
      )}
      <DetailsCardRow title="Date of patent issue">
        {formatDate(data.patentIssueDate)}
      </DetailsCardRow>
      <DetailsCardRow title="Preferred terms">
        {printList(data.preferredTerms)}
      </DetailsCardRow>
      {data.preferredTerms?.some(v => v.value === OTHER_OPTION) && (
        <DetailsCardRow title="Preferred terms (other)">
          {data.preferredTermsOther}
        </DetailsCardRow>
      )}
      <DetailsCardRow title="Associated files/media">
        {data.associatedFilesOrMedia?.map(({ href, name }) => (
          <Link
            display="flex"
            alignItems="center"
            isExternal
            href={href}
            key={href}
            gap="2"
          >
            {name}
            <Icon as={MdOpenInNew} />
          </Link>
        ))}
      </DetailsCardRow>
    </DetailsCardBody>
  ) : (
    <Loader />
  )
}

export default IpListingIpDetails
