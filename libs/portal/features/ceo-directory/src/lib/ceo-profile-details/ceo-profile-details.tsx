import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'
import {
  CompanyApiEnum,
  useGetCeoById,
  useGetUserInfo
} from '@redesignhealth/portal/data-assets'
import { CeoProfileDetailsPage } from '@redesignhealth/portal/ui'
import { printPersonName } from '@redesignhealth/portal/utils'
import { Loader } from '@redesignhealth/ui'

export const CeoProfileDetails = () => {
  const { ceoId } = useParams()
  const { data: ceo } = useGetCeoById(ceoId)
  const { data: user } = useGetUserInfo()

  return ceo ? (
    <>
      <Helmet>
        <title>CEO Profile Details: {printPersonName(ceo.member)}</title>
      </Helmet>
      <CeoProfileDetailsPage
        name={`${ceo.member.givenName} ${ceo.member.familyName}`}
        email={ceo.member.email}
        location={ceo.location}
        biography={ceo.bio}
        pictureHref={ceo.pictureHref}
        company={{
          href: ceo.member.company?.href,
          name: ceo.member.company?.name
        }}
        companyFundraiseStatus={
          ceo.member.company?.fundraiseStatus?.displayName
        }
        companyDescription={ceo.member.company?.description}
        customerSegments={ceo.customerSegment?.map(
          (segment: CompanyApiEnum) => {
            return segment.displayName
          }
        )}
        linkedInProfileHref={ceo.linkedinHref}
        healthcareSector={ceo.healthcareSector?.displayName}
        marketServiceArea={ceo.marketServiceArea}
        isOptIn={ceo.visible?.value === 'OPT_IN'}
        businessFocusArea={ceo.businessFocusArea?.map(
          (area: CompanyApiEnum) => {
            return area.displayName
          }
        )}
        businessType={ceo.businessType?.displayName}
        additionalInfo={ceo.additionalInfo}
        isSameUser={user?.ceoInfo?.id === ceoId}
        currentRole={user?.role?.authority}
      />
    </>
  ) : (
    <Loader />
  )
}

export default CeoProfileDetails
